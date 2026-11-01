-- Tag every query a model runs with the model's name, so the warehouse's
-- history can say which model spent the time (dbt-snowflake's pattern).
{% macro set_query_tag() -%}
  {% set original = get_current_query_tag() %}
  {% do run_query("alter session set query_tag = '" ~ model.name ~ "'") %}
  {{ return(original) }}
{%- endmacro %}
