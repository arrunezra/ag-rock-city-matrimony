ALTER VIEW V_Profile as (
    SELECT 
    p.profile_id
    ,p.userid
    ,p.first_name
    ,p.last_name
    ,CONCAT(p.first_name, ' ', p.last_name) AS full_name
    ,p.dob
    ,calculate_age(p.dob) AS age
    ,p.gender
    ,p.email
    ,p.phone
    ,p.address
    ,p.city
    ,GetLookupValues(11, p.city) AS city_name
    ,p.state
    ,GetLookupValues(6, p.state) AS state_name
    ,p.country
    ,GetLookupValues(5, p.country) AS country_name
    ,p.updated_at

    -- Background Details
    ,pb.religion
    ,GetLookupValues(1, pb.religion)  AS religion_name

    ,pb.community
    ,GetLookupValues(2, pb.community)  AS community_name

    ,pb.sub_community
    ,GetLookupValues(13, pb.sub_community)  AS sub_community_name

    ,pb.mother_tongue
    ,GetLookupValues(3, pb.mother_tongue)  AS mother_tongues_name
    ,pb.is_caste_no_bar
    -- Family Details
    ,pf.marital_status
    ,GetLookupValues(7, pf.marital_status) AS marital_status_name

    ,pf.family_type
    ,pf.father_occupation
    ,GetLookupValues(14, pf.father_occupation) AS father_occupation_name
    ,pf.mother_occupation
    ,GetLookupValues(14, pf.mother_occupation) AS mother_occupation_name
    ,pf.noof_sibling
    ,pf.sister_count
    ,pf.kids_details
    ,pf.brother_count
    ,pf.has_children
    ,pf.children_count
    ,pf.aboutus
    ,pf.hobbies

    -- Physical Details
    ,pph.height
    ,pph.weight
    ,pph.blood_group
    ,pph.health_info
    ,pph.disability
    -- Professional Details 
    ,ppr.qualification
    ,ppr.income
    ,ppr.work_with
    ,ppr.company_name

FROM profiles p
LEFT JOIN users us ON p.userid = us.userid 
LEFT JOIN profiles_background pb ON p.profile_id = pb.profile_id
LEFT JOIN profiles_family pf ON p.profile_id = pf.profile_id
LEFT JOIN profiles_physical pph ON p.profile_id = pph.profile_id
LEFT JOIN profiles_professional ppr ON p.profile_id = ppr.profile_id
WHERE us.Role = 'member'
                         
)

 