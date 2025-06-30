import {Outlet} from 'react-router';

function Usuarios() {
    return (
        <>
            <h1>Usuarios Page</h1>
            <p>Welcome to the usuarios page!</p>
            <Outlet />
            
        </>
    );
}
export default Usuarios;
// This component can be used to display user-related information or manage user accounts.
// You can add functionality such as listing users, adding new users, or editing existing user details