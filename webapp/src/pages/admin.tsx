import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { getAccountInfo, CharityType, getCharities, setCharityApproved } from "@/util/request";

const Admin = (): JSX.Element => {
    const router = useRouter();
    const [isStaffAccount, setIsStaffAccount] = useState<boolean>(false);
    const [charities, setCharities] = useState<CharityType[]>();

    useEffect(() => {
        getAccountInfo().then((response) => {
            const data = response.data;
            if (data.is_active && data.is_staff) {
                setIsStaffAccount(true);
            }
        }).catch(() =>
            router.push("home"))
    }, []);

    const updateCharityList = () => {
        /* TODO: Deal with sorting the data */
        getCharities().then((response) => setCharities(response.data)).catch((e) => console.log(e));
    }

    useEffect(() => {
        if (isStaffAccount) {
            updateCharityList();
        }
    }, [isStaffAccount])

    return <>
        <div className="w-1/2 mt-10 m-auto">
            <h2>Charities</h2>
            <table>
                <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {charities?.map((charity) => <tr key={charity.id}>
                        <td></td>
                        <td>{charity.name}</td>
                        <td>{charity.email}</td>
                        <td>{charity.phone_number}</td>
                        <td><button onClick={() => {
                            setCharityApproved(charity.id, !charity.is_approved).then(() => updateCharityList());
                        }}>{charity.is_approved ? <FaCircleCheck color="green" /> : <FaCircleXmark color="red" />}</button></td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </>
}

export default Admin;
