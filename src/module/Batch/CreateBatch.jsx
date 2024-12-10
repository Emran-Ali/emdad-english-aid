import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { createBatch } from "@/service/BatchService";


// Define schema with Yup validation
const schema = yup.object({
    name: yup.string().required("Name is required").max(200, "Name can't exceed 200 characters"),
    students: yup.number().positive().integer().required("Students count is required"),
    year: yup.number().positive().integer().required("Year is required"),
    batch_time: yup.string().nullable(),
    batch_days_id: yup.number().positive().integer(),
    type: yup.string().max(100, "Type can't exceed 100 characters"),
}).required()

export default function CreateBatch() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        const res = await createBatch(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium">Type</label>
                    <select
                        {...register("type")}
                        id="type"
                        className="mt-1 p-2 border rounded w-full"
                    >
                        <option value="">Select Type</option>
                        <option value="academic_1st_year">Academic 1st Year</option>
                        <option value="academic_2nd_year">Academic 2nd Year</option>
                        <option value="admissions">Admissions</option>
                        <option value="re_admission">Re Admission</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
                {/* Name field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <input
                        {...register("name")}
                        type="text"
                        id="name"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Students field */}
                <div>
                    <label htmlFor="students" className="block text-sm font-medium">Number of Students</label>
                    <input
                        {...register("students")}
                        type="number"
                        id="students"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.students && <p className="text-red-500 text-sm">{errors.students.message}</p>}
                </div>

                {/* Year field */}
                <div>
                    <label htmlFor="year" className="block text-sm font-medium">Year</label>
                    <input
                        {...register("year")}
                        type="number"
                        id="year"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
                </div>

                {/* Batch Time field */}
                <div>
                    <label htmlFor="batch_time" className="block text-sm font-medium">Batch Time</label>
                    <input
                        {...register("batch_time")}
                        type="time"
                        id="batch_time"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.batch_time && <p className="text-red-500 text-sm">{errors.batch_time.message}</p>}
                </div>

                {/* Batch Days ID field */}
                <div>
                    <label htmlFor="batch_days_id" className="block text-sm font-medium">Batch Days ID</label>
                    <input
                        {...register("batch_days_id")}
                        type="number"
                        id="batch_days_id"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.batch_days_id && <p className="text-red-500 text-sm">{errors.batch_days_id.message}</p>}
                </div>

                {/* Type field */}

                {/* Submit Button */}
                <div>
                    <button type="submit"
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}
