'use client'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"





export default function App() {

    return (
        <div className="w-full">
            <div className="flex justify-between text-white">
                <div className="text-4xl font-bold">Batch List</div>
                <button className="rounded-lg p-2 bg-cyan-300 cursor-pointer font-bold" onClick={()=>{
                    console.log('modal')}} >Add New Batch</button>
            </div>

        </div>
    )
}