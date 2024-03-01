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
    imgSrc: z.string(),
    review: z.number()
})

type Product = z.infer<typeof ProductSchema>

/* -------------HTML ELEMENTS----------------- */
const appElement = document.getElementById("app")
const laptopsButton = document.getElementById("laptops") as HTMLButtonElement
const watchesButton = document.getElementById("watches") as HTMLButtonElement
const mobilesButton = document.getElementById("mobiles") as HTMLButtonElement
const laptopsDropdownButton = document.getElementById("laptops-dropdown") as HTMLButtonElement
const watchesDropdownButton = document.getElementById("watches-dropdown") as HTMLButtonElement
const mobilesDropdownButton = document.getElementById("mobiles-dropdown") as HTMLButtonElement

/* -------------FUNCTIONS----------------- */
const typesData = async (type:string) => {
    if(!type){
        return
    }

    const response = await safeFetch("GET", `http://localhost:5555/products/${type}`)
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
    const productContent = validatedData.filter((product) => product.type === type);

    const mappedProduct = productContent.map((product) => ` 
    <div class="w-[22rem] bg-base-100 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    
        <figure class="flex w-full h-[200px] justify-center pt-2"><img src="${product.imgSrc}" alt="Watch" class="w-auto h-[200px]"/></figure>
   
        <div class="px-5 pb-5">
            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-5">${product.productName}</h5>
            <div class="flex items-center mt-2.5 mb-5">
                <div class="flex items-center space-x-1 rtl:space-x-reverse">
                    <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                    <svg class="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                    <svg class="w-4 h-4 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">${product.review}</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                <button id="add-to-cart" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
            </div>
        </div>
    </div>
  `).join("");

 appElement.innerHTML= mappedProduct

}

mobilesButton.addEventListener("click", ()=>{
    typesData("smartphone")
})

laptopsButton.addEventListener("click", ()=>{
    typesData("laptop")
})

watchesButton.addEventListener("click", ()=>{
    typesData("smartwatch")
})

mobilesDropdownButton.addEventListener("click", ()=>{
    typesData("smartphone")
})

laptopsDropdownButton.addEventListener("click", ()=>{
    typesData("laptop")
})

watchesDropdownButton.addEventListener("click", ()=>{
    typesData("smartwatch")
})