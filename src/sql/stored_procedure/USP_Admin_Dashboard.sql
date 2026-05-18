DELIMITER //

CREATE OR REPLACE PROCEDURE USP_Admin_Dashboard(
    IN p_debug_mode INT -- Set to 1 to debug, 0 for production
)
BEGIN
    -- MariaDB handles temp tables best when we ensure they are clean at the start
    DROP TEMPORARY TABLE IF EXISTS temp_DashboardSummary;
    DROP TEMPORARY TABLE IF EXISTS temp_ChurchBreakdown;

    -- 1. CREATE SUMMARY TABLE
    CREATE TEMPORARY TABLE temp_DashboardSummary (
        total_staff INT,
        total_churches INT,
        total_profiles INT,
        overall_revenue DECIMAL(15,2),
        monthly_revenue DECIMAL(15,2),
        yearly_revenue DECIMAL(15,2)
    ) ENGINE=MEMORY;

    -- 2. CALCULATE SUMMARY METRICS
    INSERT INTO temp_DashboardSummary (total_staff, total_churches, total_profiles, overall_revenue, monthly_revenue, yearly_revenue)
    VALUES (
        (SELECT COUNT(*) FROM staff_details WHERE activeStatus = 'active'),
        (SELECT COUNT(*) FROM church_details WHERE active_status = 'active' AND deleted_at IS NULL),
        (SELECT COUNT(*) FROM profiles WHERE is_visible = 1),
        (SELECT IFNULL(SUM(amount), 0) FROM payments_reciept WHERE status = 'completed'),
        (SELECT IFNULL(SUM(amount), 0) FROM payments_reciept 
         WHERE status = 'completed' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())),
        (SELECT IFNULL(SUM(amount), 0) FROM payments_reciept 
         WHERE status = 'completed' AND YEAR(created_at) = YEAR(CURRENT_DATE()))
    );

    -- 3. CREATE CHURCH BREAKDOWN TABLE
    CREATE TEMPORARY TABLE temp_ChurchBreakdown (
        church_id VARCHAR(50),
        church_name VARCHAR(255),
        profile_count INT,
        total_amount DECIMAL(15,2),
        trend VARCHAR(10)
    ) ENGINE=MEMORY;

    -- 4. POPULATE CHURCH BREAKDOWN 
    INSERT INTO temp_ChurchBreakdown (church_id,church_name, profile_count, total_amount, trend)
    SELECT 
        cd.church_id
        ,cd.church_name
        ,COUNT(DISTINCT p.profile_id) as profile_count
        ,IFNULL(SUM(pr.amount), 0) as total_amount
        ,CASE WHEN SUM(pr.amount) > 5000 THEN 'up' ELSE 'stable' END as trend
    FROM church_details cd
    LEFT JOIN profiles_background pb ON cd.church_id = pb.church_id
    LEFT JOIN profiles p ON pb.profile_id = p.profile_id
    LEFT JOIN payments_reciept pr ON p.profile_id = pr.profile_id AND pr.status = 'completed'
    WHERE cd.deleted_at IS NULL
    GROUP BY cd.id, cd.church_name
    ORDER BY total_amount DESC
    LIMIT 50;

    -- 5. FINAL OUTPUTS
    -- Result Set 1
    SELECT * FROM temp_DashboardSummary;

    -- Result Set 2
    SELECT * FROM temp_ChurchBreakdown;

    -- 6. DEBUGGING
    IF p_debug_mode = 1 THEN
        SELECT 'DEBUG: Summary' as stage, s.* FROM temp_DashboardSummary s;
        SELECT 'DEBUG: Church List' as stage, b.* FROM temp_ChurchBreakdown b;
    END IF;

    -- Optional: Cleanup at the end of the session
    DROP TEMPORARY TABLE IF EXISTS temp_DashboardSummary;
    DROP TEMPORARY TABLE IF EXISTS temp_ChurchBreakdown;

END //

DELIMITER ;