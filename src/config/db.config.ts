import {connect , ConnectOptions } from 'mongoose'

export const dbConnect = () => {
    connect(process.env.MOONGO_DB!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connect successfully"),
        (error) => console.log(error)
    )
}