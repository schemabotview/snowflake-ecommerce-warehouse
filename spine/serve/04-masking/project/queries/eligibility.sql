-- Who could have used each campaign, and who bought through it.
SELECT e.campaign_id, COUNT(DISTINCT e.customer_id) AS eligible,
       COUNT(DISTINCT s.customer_id) AS bought_through_it
FROM FCT_ELIGIBILITY AS e
LEFT JOIN FCT_SESSIONS AS s
  ON s.customer_id = e.customer_id AND s.campaign = e.campaign_id
 AND s.purchased
GROUP BY 1 ORDER BY 2 DESC, 1;
