-- One row per click event: typed out of the VARIANT, one name for the
-- device across the June 1 change, and the tracker's duplicates removed.
select
    v:event_id::string as event_id,
    v:event_ts::timestamp_ntz as event_ts,
    v:event_type::string as event_type,
    v:user_id::number as customer_id,
    v:anon_id::string as anon_id,
    coalesce(v:context.device_type, v:context.device)::string as device,
    v:context.campaign::string as campaign,
    v:consent::string as consent
from {{ source('shopwave', 'clicks') }}
qualify row_number() over (
    partition by v:event_id order by _loaded_at, _file) = 1
