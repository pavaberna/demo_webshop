import express from "express"
import { z } from "zod"
import filesystem from "fs/promises"
import cors from "cors"

const server = express()
server.use(cors())

server.use(express.json())

const ProductSchema = z.object({
    id: z.number(),
    type: z.string(),
    productName: z.string(),
    price: z.number(),
    imgSrc: z.string()
})

const CartSchema = z.object({
    id: z.number(),
    type: z.string(),
    productName: z.string(),
    price: z.number(),
    quantity: z.number()
})

const QueryParamSchema = z.object({
    type: z.string(),
    min: z.coerce.number(),
    max: z.coerce.number()
})

type Product = z.infer<typeof ProductSchema>
type Cart = z.infer<typeof CartSchema>


const readfile = async(database: string) => {
    try {
        const rawData = await filesystem.readFile(`${__dirname}/../${database}`, "utf-8");
        const products:Product[] = JSON.parse(rawData)
        console.log(products)
        return products
    } catch (error) {
        return null
    }
}

const writefile = async (data: any, database: string) => {
    try {
        const fileContent = JSON.stringify(data)
        await filesystem.writeFile(`${__dirname}/../${database}`, fileContent)
        return true
    } catch (error) {
        return false
    }
}

//GET requests
server.get("/products/all", async (req, res) => {
    const products = await readfile("database/products.json")
    if (!products) return res.sendStatus(500)
    res.json(products)
})

server.get("/products/all/filter", async (req, res) => {
    const result = QueryParamSchema.safeParse(req.query)
    if (!result.success) {
        return res.status(400).json(result.error.issues)
    }
    const products: Product[] | null = await readfile("database/products.json")
    if (products === null) {
        res.sendStatus(500)
        return
    }

    const searchParams = result.data
    const filteredProduct = products.filter((product) => {
        return (
            product.type === searchParams.type &&
            product.price > searchParams.min &&
            product.price < searchParams.max
        )
    })

    res.json(filteredProduct)
})

server.get("/products/:type", async (req, res) => {
    const type = req.params.type
    const products = await readfile("database/products.json")
    if (!products)
        return res.sendStatus(500)

    const filteredProductTypes = products?.filter(product => product.type === type)
    res.json(filteredProductTypes)
})

server.get("/cart", async (req, res) => {
    const cart = await readfile("database/cart.json")
    res.json(cart)
})

//POST requests
/* server.post("/products/all", async (req, res) => {
    const result = CartSchema.safeParse(req.body)
    if (!result.success)
        return res.status(400).json(result.error.issues)
    const addCart = result.data

    const cartData: Cart[] | null = await readfile("database/cart.json")
    if (!cartData) return res.sendStatus(500)

    cartData.forEach((products) => {
        if (addCart.id === products.id) {
            addCart.quantity++
        } else {
            addCart.quantity = 1
        }
    })

    const isSuccessful = await writefile([...cartData, { ...addCart }], "database/cart.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.json({ ...cartData })
}) */

/* server.post("/cart", async (req, res) => {
    const result = CartSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json(result.error.issues)
    }
    const products: Cart[] | null = await readfile("database/cart.json")
    if (!products) return res.sendStatus(500)

    products.push(result.data)

    const isSuccessful = await writefile(products, "database/cart.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.json("Rendelés leadva")
}) */

/* server.post("/cart/order", async (req, res) => {
    const result = CartSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error.issues)

    const products: Cart[] | null = await readfile("database/cart.json")
    if (!products) return res.sendStatus(500)

    const randomOrderNumber = Math.floor(Math.random() * 1000)
    products.push({ ...result.data, id: randomOrderNumber })

    const isSuccessful = await writefile(products, "database/order.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.json({ id: randomOrderNumber })
}) */

// DELETE requests
/* server.delete("/cart/:id", async (req, res) => {
    const result = z.coerce.number().safeParse(req.params.id)
    if (!result.success) return res.status(400).json(result.error.issues)
    const id = result.data

    const cart: Cart[] | null = await readfile("database/cart.json")
    if (!cart) return res.sendStatus(500)

    const filteredProducts = cart.filter((product) => product.id !== id)
    if (!filteredProducts) return res.sendStatus(500)

    const isSuccessful = await writefile(filteredProducts, "database/cart.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.sendStatus(200)
}) */

server.delete("/editor/products/:id", async (req, res) => {
    const result = z.coerce.number().safeParse(req.params.id)

    if (!result.success) return res.status(400).json(result.error.issues)
    const id = result.data

    const products: Product[] | null = await readfile("database/products.json")
    if (!products) return res.sendStatus(500)

    const filteredProducts = products.filter((product) => product.id !== id)
    if (!filteredProducts) return res.sendStatus(500)

    const isSuccessful = await writefile(filteredProducts, "database/products.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.sendStatus(200)
})

//PATCH request
server.patch("/editor/products/:id", async (req, res) => {
    const id = +req.params.id

    const products: Product[] | null = await readfile("database/products.json")
    if (!products) return res.sendStatus(500)

    const productToUpdate = products.find(product => product.id === id)
    if (!productToUpdate) return res.sendStatus(404)

    const result = ProductSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json(result.error.issues)

    const updatedProduct = products.map(product => {
        if (product.id === id) {
            return { ...result.data, id }
        }
        return product
    })

    const isSuccessful = await writefile(updatedProduct, "database/products.json")
    if (!isSuccessful) return res.sendStatus(500)

    res.sendStatus(200)
})

server.listen(5555)