
import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction } from "react";
import axios from "./axios"
import Router from "next/router";
import { FileType , User} from "../types";

export const _setFile = async (e: ChangeEvent<HTMLInputElement>, setLocalFile: Dispatch<SetStateAction<File | undefined>>) => {
    if (!e.target.files?.length) {
        return
    }
    setLocalFile(e.target.files[0])
}


export const _uploadFile = async (files: FileType[], file: File | undefined,  setUploadStatus: Dispatch<SetStateAction<boolean>>, loadeing: Boolean, setFiles: Dispatch<SetStateAction<FileType[]>>, fileRef : MutableRefObject<HTMLInputElement | null>) => {
    
    try {
        if (!file || loadeing) {
            return
        }
        setUploadStatus(true)
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (event: any) => {
                let loaded = Math.round((event.loaded * 100) / event.total)
                console.log(`Current progress:`, loaded);
            },
        };

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post('/api/auth/uploads', formData, config);
    
        files.push(response.data)
        setFiles(files)
        setUploadStatus(false)
    } catch (error) {
        alert("server error")
        setUploadStatus(false)
    }

}

export const _getFiles = async (setFiles: Dispatch<SetStateAction<any[]>>, setLoading: Dispatch<SetStateAction<boolean>>) => {
    try {
        let fileRes = await axios.post("/api/auth/files")
        setFiles(fileRes.data)
        setLoading(false)
    } catch (error) {
        setLoading(false)
    }
}

export const _getUser = async (setAuthUser:  Dispatch<SetStateAction<User | undefined>>) => {
    try {
        let user = await axios.get("/api/auth/me")
        setAuthUser(user.data)
    } catch (error) {
        console.log(error);
    }
}



export const _logOut = async (e: any) => {
    try {
        e.preventDefault()
        await axios.post("/api/auth/logout")
        Router.push("/")
    } catch (error) {
        alert("something went wrong")
    }
}