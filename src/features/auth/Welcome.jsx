import { useSelector } from "react-redux"
import { selectCurrentUser, selectCurrentToken } from "./authSlice"
import { Link } from "react-router-dom"

const Welcome = () => {
    const user = useSelector(selectCurrentUser)

    const welcome = user?.username ? `Welcome ${user.username}!` : 'Welcome!'

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p><Link to="/current-user">Go to the Users List</Link></p>
        </section>
    )

    return content
}
export default Welcome