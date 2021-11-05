import { Router } from "express"

export default () => {
  const router = Router()

  router.get("/store/top-products", async (req, res) => {
    const topProductsService = req.scope.resolve("topProductsService")

    res.json({
      products: await topProductsService.getTopProducts()
    })
  })

  return router;
}