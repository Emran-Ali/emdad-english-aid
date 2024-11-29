'use client'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


const schema = yup
    .object({
        firstName: yup.string().required(),
        age: yup.number().positive().integer().required(),
    })
    .required()


export default function CreateBatch() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })
    const onSubmit = (data) => console.log(data)


    return (
        <div>
            <div>Batch List</div>
            <button onClick={onSubmit} className="h-6 w-6 cursor-pointer">Add New Batch</button>
        </div>
    )
}