import type { Section } from '../types'

export const genericTests: Section = {
  id: 'generic-tests',
  title: "Generic tests",
  scene: 'transform-generic-tests',
  narration:
    "A model that builds is not a model that is right. d b t tests are how the warehouse checks itself, and the simplest are generic tests, written as a few lines of configuration. The editor shows them, in a file beside the marts. Every test is a query that should return no rows; any row it returns is a failure. The order line key must be unique and never null: that is the grain, checked on every build. The customer key and the product key must never be null, and each must have a matching row in its dimension: that is what relationships means, and it catches a fact row pointing at a customer who does not exist. The order status must be one of the three values the shop uses. And each dimension's key must be unique. Look at the side pane. The diagram shows where the tests sit on the model: the fact, checked against both dimensions. Under it, the four tests d b t ships with, and what makes each one fail. These four catch most of the mistakes a model can make: a duplicated row, a missing value, a broken join, a value nobody expected. The terminal runs d b t test on the marts, and the note at the bottom gives the result, from the run: how many passed, and how many failed. These tests check the model's structure. They do not check whether the business makes sense, and Shopwave's data has two problems no generic test can see.",
}
