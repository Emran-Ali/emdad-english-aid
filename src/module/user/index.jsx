'use client'
import { useState } from "react";
import Modal from "@/components/Modal";
import CreateBatch from "@/module/Batch/CreateBatch";
import CreateUser from "@/module/user/CreateUser";

export default function User() {
    const [modal, setModal] = useState(false);
    const onClose = () => {
        setModal(false);
    }
    return (
        <div className="w-full">
            <div className="flex justify-between text-white">
                <div className="text-4xl font-bold">User List</div>
                <button className="rounded-lg px-3 py-2 bg-cyan-700 cursor-pointer font-bold" onClick={() => {
                    setModal(true)
                }} >Add New User</button>
            </div>
            <Modal isOpen={modal} onClose={onClose} title={'Add New User'} >
                <CreateUser />
            </Modal>
        </div>
    )
}