import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "../../components/UserCard/UserCard";
import Pagination from "../../components/Pagination/Pagination";
import AddUser from "../../components/AddUser/AddUser";
import "./UsersPage.scss";


export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingUser, setEditingUser] = useState(null);


    const getUsers = async (newPage = 1) => {
        const res = await axios("https://reqres.in/api/users?page=" + newPage);
        console.log(res.data.data);
        setUsers(res.data.data);
        setTotalPages(res.data.total_pages);

    };
    useEffect(() => {
        getUsers();
        setIsLoaded(true);
    }, []);


    const onAdd = async (first_name, last_name, avatar, email) => {
        await fetch("https://reqres.in/api/users", {
            method: "POST",
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                avatar: avatar,
                email: email,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                } 
            })
            .then((data) => {
                setUsers((users) => [...users, data]);
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onEdit = async (userId, first_name, last_name, avatar, email) => {
        await fetch(`https://reqres.in/api/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                avatar: avatar,
                email: email,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } 
            })
            .then((data) => {
                setUsers(users.map(user => user.id !== userId ? user : {
                    ...user,
                    first_name,
                    last_name,
                    avatar,
                    email,
                }))
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onStartEdit = (user) => {
        setEditingUser(user)
    }

    const onStopEdit = () => {
        setEditingUser(null)
    }


    const onDelete = async (id) => {
        setIsLoaded(true)
        await fetch(`https://reqres.in/api/users/${id}`)
            .then((res) => {
                if (res.status === 200 || res.status === 404) {
                    setUsers(
                        users.filter((user) => {
                            return user.id !== id;
                        })
                    );
                    console.log(`User with id ${id} deleted.`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }



    return (
        <div>
            {!isLoaded ? (
                <div>
                    <img
                        src="./assets/loading.gif"
                        alt="Loading gif"
                    />
                </div>
            ) : (
                <div>
                    <AddUser onAdd={onAdd} onEdit={onEdit} user={editingUser} onStopEdit={onStopEdit} />
                    <Pagination getUsers={getUsers} totalPages={totalPages} />
                    <div className="container">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                first_name={user.first_name}
                                last_name={user.last_name}
                                avatar={user.avatar}
                                email={user.email}
                                onDelete={onDelete}
                                onEdit={onStartEdit}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
