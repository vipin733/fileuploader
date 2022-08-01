
import { useState, useEffect, useRef } from "react"
import {  User , FileType } from "../types"
import { _getFiles, _getUser, _logOut, _setFile, _uploadFile } from "../lib/clientHelper";

const Index = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [localFile, setLocalFile] = useState<File>();
    const [authUser, setAuthUser] = useState<User>();
    const [loadeing, setLoading] = useState(true)

    const fileRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        _getFiles(setFiles, setLoading)
        _getUser(setAuthUser)
    }, [])


    return (
        <div>

            <h3>Hello {authUser?.name} <a href="" onClick={_logOut}>LogOut</a></h3>

            {
                loadeing ? <h3> Wait... </h3> : null
            }

            <form>
                <input  ref={fileRef} type="file" name="file" onChange={e => _setFile(e, setLocalFile)} />
                <button  type="button" onClick={() => _uploadFile(files, localFile, setLoading,loadeing, setFiles, fileRef)}>Submit</button>
            </form>
            <br />
            <br />

        
            <table>
                <tr>
                    <th>ID</th>
                    <th>URL</th>
                    <th>Download</th>
                </tr>

                {
                    files && files.map((file, index) => {
                        return (
                            <tr key={index}>
                                <td>{`${file.id}`}</td>
                                <td>{file.name}</td>
                                <td>
                                    <a href={`/api/auth/download?file=${file.uuid}`} target="_blank">Download</a>
                                </td>
                            </tr>
                        )
                    })
                }


            </table>
        </div>
    )
}

export default Index