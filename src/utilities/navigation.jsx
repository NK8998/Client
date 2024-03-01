import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const isFetching = useSelector((state) => state.app.isFetching);

  const handleNavigation = (e, route) => {
    e.preventDefault();
    if (isFetching) return;
    navigate(`${route}`);
  };

  return handleNavigation;
};
