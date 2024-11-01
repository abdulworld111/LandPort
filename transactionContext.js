import { createContext, useState } from "react";

export const TransContext = createContext()

export default TransProvider = ({children}) => {
    const [ senderName, setSenderName ] = useState("")
    const [ senderLocation, setSenderLocation ] = useState("")
    const [ senderPhoneNumber, setSenderPhoneNumber ] = useState("")
    const [ recieverName, setRecieverName ] = useState("")
    const [ recieverLocation, setRecieverLocation ] = useState("")
    const [ recieverPhoneNumber, setRecieverPhoneNumber ] = useState("")
    const [ productName, setProductName ] = useState("")
    const [ productQuantity, setProductQuantity ] = useState("")
    const [ productImage, setProductImage ] = useState("")
    const [ customer, setCustomer ] = useState({})
    const [ recieverDetails, setRecieverDetails ] = useState([{recieverName: "", recieverPhoneNumber: "", location: null}])
    
    const [ rideType, setRideType ] = useState("Single")

    return(
        <TransContext.Provider 
            value={{ 
                senderName, 
                setSenderName,
                senderLocation,
                setSenderLocation,
                senderPhoneNumber,
                setSenderPhoneNumber,
                recieverName,
                setRecieverName,
                recieverLocation,
                setRecieverLocation,
                recieverPhoneNumber,
                setRecieverPhoneNumber,
                productName,
                setProductName,
                productQuantity,
                setProductQuantity,
                productImage,
                setProductImage,
                rideType,
                setRideType,
                customer,
                setCustomer,
                recieverDetails,
                setRecieverDetails
            }}
        >
            {children}
        </TransContext.Provider>
    )
}

// export default TransContext
// export TransProvider