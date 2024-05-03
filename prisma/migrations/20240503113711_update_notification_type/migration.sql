update "notification" set "type" = 'NewFollowupElement' where social_support_id in (
    select id from social_support where social_support_type = 'Followup'
);