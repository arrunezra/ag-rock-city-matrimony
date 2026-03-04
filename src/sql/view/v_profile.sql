ALTER VIEW V_Profile as (
    SELECT
        p.id AS id,
        p.userid AS userid,
        p.first_name AS first_name,
        p.last_name AS last_name,
        CONCAT(p.first_name, ' ', p.last_name) AS full_name,
        p.dob AS dob,
        p.gender AS gender,
        p.religion AS religion,
        p.community AS community,
        p.sub_community AS sub_community,
        p.email AS email,
        p.phone AS phone,
        p.alt_phone AS alt_phone,
        p.address AS address,
        p.city,
        p.state,
        p.country AS country,
        p.marital_status AS marital_status,
        p.height,
        p.qualification,
        p.college,
        p.income,
        p.work_with,
        p.WorkingAs,
        p.company_name,
        p.profile_pic,
        p.profile_thumb AS profile_thumb,
        p.children_count,
        p.kids_details,  
        p.aboutus,
        p.hobbies,  
        p.family_type,
        p.father_occupation,
        p.mother_occupation,
        p.Noof_sibling,
        p.sister_count,
        p.brother_count,
        p.updated_at AS updated_at,
        us.IsActive AS IsActive,
        us.IsVerified AS IsVerified,
        us.Role AS Role,
        st.LookupValue AS state_name,
        ct.LookupValue AS city_name
    FROM profiles p

    LEFT JOIN users us
        ON us.userid = p.userid

    LEFT JOIN t_tran_lookup st
        ON p.state = st.LookupKey

    LEFT JOIN t_tran_lookup ct
        ON p.city = ct.LookupKey

    WHERE us.Role = 'member'
                         
)