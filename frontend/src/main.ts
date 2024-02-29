import './style.css'
import 'flowbite';
import { z } from "zod"
import { safeFetch } from './safeFetch'

/* -------------TYPES----------------- */
const ProductSchema = z.object({
    id: z.number(),
    type: z.string(),
    productName: z.string(),
    price: z.number(),
    imgSrc: z.string()
})

type Product = z.infer<typeof ProductSchema>

/* -------------HTML ELEMENTS----------------- */
const appElement = document.getElementById("app") as HTMLDivElement
const homePage = document.getElementById("home-page") as HTMLButtonElement

/* -------------FUNCTIONS----------------- */
const getHomePageData = async () => {
    const response = await safeFetch("GET", "http://localhost:5555/products/all")
    if (!response.success) {
        alert(response.status);
        return
    }

    if (response.status >= 500) {
        return;
    }

    if (!response) return;

    const products = response.data
    const result = ProductSchema.array().safeParse(products)

    if (!result.success) {
        alert("Oops");
        return;
    };

    const validatedData = result.data

    appElement.innerHTML = `
    <div class="card w-96 bg-base-100 shadow-xl">
    <figure class="px-10 pt-10">
      <img src="assets/laptop-with-blank-black-screen-white-table_53876-97915.jpg" alt="Laptop" class="rounded-xl" />
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">Laptopok</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions">
        <button id="laptop" class="btn btn-primary text-white hover:bg-violet-600">Megnézem</button>
      </div>
    </div>
  </div>
  <div class="card w-96 bg-base-100 shadow-xl">
    <figure class="px-10 pt-8">
      <img src="assets/smartwatch-screen-digital-device_53876-97321.jpg" alt="Smartwatch" class="rounded-xl" />
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">Okosórák</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions">
        <button id="smartwatch" class="btn btn-primary text-white hover:bg-violet-600">Megnézem</button>
      </div>
    </div>
  </div>
  <div class="card w-96 bg-base-100 shadow-xl">
    <figure class="px-10 pt-10">
      <img src="assets/close-up-hand-holding-smartphone_23-2149148857.jpg" alt="Smartphone" class="rounded-xl" />
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">Telefonok</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions">
        <button id="mobile" class="btn btn-primary text-white hover:bg-violet-600">Megnézem</button>
      </div>
    </div>
  </div>
  `
}

homePage.addEventListener("click", () => {
    getHomePageData()
})