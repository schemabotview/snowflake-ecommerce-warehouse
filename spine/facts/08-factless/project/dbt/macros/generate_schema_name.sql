{# A model's +schema is the schema it lands in: STAGING, MARTS, BI.
   (dbt's default would prefix the target's schema: MARTS_STAGING.) #}
{% macro generate_schema_name(custom_schema_name, node) -%}
    {{ (custom_schema_name or target.schema) | trim | upper }}
{%- endmacro %}
