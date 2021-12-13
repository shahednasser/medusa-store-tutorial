import bodyParser from "body-parser"
import cors from "cors"
import { Router } from "express"
import { projectConfig } from "../../medusa-config"

export default () => {
  const router = Router()

  const corsOptions = {
    origin: projectConfig. admin_cors.split(","),
    credentials: true,
  }

  router.get("/store/top-products", async (req, res) => {
    const topProductsService = req.scope.resolve("topProductsService")

    res.json({
      products: await topProductsService.getTopProducts()
    })
  })

  router.options('/admin/top-products', cors(corsOptions))
  router.get("/admin/top-products", cors(corsOptions), bodyParser.json(), async (req, res) => {
    const topProductsService = req.scope.resolve("topProductsService")

    res.json({
      products: await topProductsService.getTopProducts()
    })
  })

  return router;
}