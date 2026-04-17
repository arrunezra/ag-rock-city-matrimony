DELIMITER //

CREATE OR REPLACE PROCEDURE GetProfileDashboardSummary(
    IN target_profile_id VARCHAR(20), 
    IN account_mode VARCHAR(20),  -- 'Staff', 'Profile', 'Admin'
    IN view_mode VARCHAR(10),     -- 'COUNT' or 'LIST'
    IN filter_by VARCHAR(20)      -- 'likes', 'views', 'accepted', 'requests'
    IN limit_val INT=20,             -- Number of records to fetch
    IN offset_val INT = 0            -- Number of records to skip
)
BEGIN
    -- 1. Setup Temp Blocked Table for Security
    -- 2. BRANCHING: COUNT MODE (Ignores limit/offset)
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_blocked_ids (id VARCHAR(20) PRIMARY KEY);
    IF account_mode = 'Profile' THEN
        INSERT IGNORE INTO temp_blocked_ids
        SELECT blocked_id FROM profiles_blocks WHERE blocker_id = target_profile_id
        UNION
        SELECT blocker_id FROM profiles_blocks WHERE blocked_id = target_profile_id;
    END IF;

    -- 3. BRANCHING: COUNT MODE
    IF view_mode = 'COUNT' THEN
        SELECT 
            (SELECT COUNT(*) FROM profiles_interests WHERE receiver_id = target_profile_id AND status = 'Pending' AND sender_id NOT IN (SELECT id FROM temp_blocked_ids)) AS requests_count,
            (SELECT COUNT(*) FROM profiles_interests i WHERE (i.sender_id = target_profile_id OR i.receiver_id = target_profile_id) AND status = 'Accepted' AND (CASE WHEN i.sender_id = target_profile_id THEN i.receiver_id ELSE i.sender_id END) NOT IN (SELECT id FROM temp_blocked_ids)) AS accepted_count,
            (SELECT COUNT(*) FROM profile_likes WHERE sender_id = target_profile_id AND profile_id NOT IN (SELECT id FROM temp_blocked_ids)) AS likes_count,
            (SELECT COUNT(*) FROM profiles_views WHERE viewed_profile_id = target_profile_id) AS views_count;

    -- 3. BRANCHING: LIST MODE
    -- 4. BRANCHING: LIST MODE (With Pagination)

    ELSEIF view_mode = 'LIST' THEN
        IF filter_by = 'likes' THEN
            SELECT p.profile_id, p.full_name, p.file_name, p.city_name, 'Liked' as sub_text
            FROM profile_likes l
            INNER JOIN V_Profile p ON l.profile_id = p.profile_id
            WHERE l.sender_id = target_profile_id 
            AND (account_mode != 'Profile' OR p.profile_id NOT IN (SELECT id FROM temp_blocked_ids));
            LIMIT limit_val OFFSET offset_val;

        ELSEIF filter_by = 'views' THEN
            SELECT p.profile_id, p.full_name, p.file_name, p.city_name, v.viewed_at as sub_text
            FROM profiles_views v
            INNER JOIN V_Profile p ON v.viewer_id = p.profile_id
            WHERE v.viewed_profile_id = target_profile_id
            ORDER BY v.viewed_at DESC;
            LIMIT limit_val OFFSET offset_val;

        ELSEIF filter_by = 'accepted' THEN
            SELECT p.profile_id, p.full_name, p.file_name, p.city_name, p.city, 'Connected' as sub_text
            FROM profiles_interests i
            INNER JOIN V_Profile p ON (i.sender_id = p.profile_id OR i.receiver_id = p.profile_id)
            WHERE (i.sender_id = target_profile_id OR i.receiver_id = target_profile_id)
            AND i.status = 'Accepted' AND p.profile_id != target_profile_id
            AND (account_mode != 'Profile' OR p.profile_id NOT IN (SELECT id FROM temp_blocked_ids));
            LIMIT limit_val OFFSET offset_val;

        ELSEIF filter_by = 'requests' THEN
            SELECT p.profile_id, p.full_name, p.file_name, p.city_name, i.created_at as sub_text
            FROM profiles_interests i
            INNER JOIN V_Profile p ON i.sender_id = p.profile_id
            WHERE i.receiver_id = target_profile_id AND i.status = 'Pending'
            AND (account_mode != 'Profile' OR p.profile_id NOT IN (SELECT id FROM temp_blocked_ids));
            LIMIT limit_val OFFSET offset_val;
        END IF;
    END IF;

    DROP TEMPORARY TABLE IF EXISTS temp_blocked_ids;
END //

DELIMITER ;