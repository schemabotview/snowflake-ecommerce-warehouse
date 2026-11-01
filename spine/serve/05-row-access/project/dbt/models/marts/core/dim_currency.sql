-- The currencies Shopwave is paid in. EUR is the reporting currency.
select md5(code) as currency_key, code, name, code = 'EUR' as is_reporting
from (values ('EUR', 'Euro'), ('GBP', 'Pound sterling'),
             ('USD', 'US dollar'), ('INR', 'Indian rupee')) as c (code, name)
