import Detail from "../components/user/Detail";
import PasswordSetting from "../components/user/PasswordSetting";
import "../assets/css/profile.css";

const UserPage = () => {
  return (
    <div className="container-fluid px-0 bb-pf-wrap">
      <div className="row g-3 align-items-start">
        <div className="col-12 col-xl-7">
          <Detail />
        </div>
        <div className="col-12 col-xl-5">
          <PasswordSetting />
        </div>
      </div>
    </div>
  );
};

export default UserPage;