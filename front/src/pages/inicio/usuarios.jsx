import { Outlet } from "react-router";

function Usuarios() {
  return (
    <>
      <div className="layout">
        <main className="layout-main bordered">
          
          <Outlet />
        </main>
        <footer className="layout-footer bordered">2022 KeepCoding</footer>
      </div>
      
    </>
  );
}
export default Usuarios;
// This component can be used to display user-related information or manage user accounts.
// You can add functionality such as listing users, adding new users, or editing existing user details
