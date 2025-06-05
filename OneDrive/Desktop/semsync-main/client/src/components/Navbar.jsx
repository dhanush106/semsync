import React, { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiHelpCircle,
  FiCalendar,
  FiAward,
  FiChevronsRight,
  FiPieChart,
  FiBookmark,
  FiEdit,
  FiTrendingUp,
  FiStar,
  FiBarChart,
  FiList,
  FiCheckSquare,
  FiClock,
  FiFlag
} from "react-icons/fi";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <motion.nav
      layout
      className="navbar"
      style={{
        width: open ? "225px" : "fit-content",
        borderRadius: open ? "0 30px 30px 0" : "0 20px 20px 0"
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <TitleSection open={open} />

      <div className="navbar-menu">
        <Option
            Icon={FiHome}
            title="Dashboard"
            open={open}
            iconOptions={[FiPieChart, FiBarChart]}
            to="/"
        />
        <Option Icon={FiBookOpen} title="Subjects" open={open} iconOptions={[FiBookmark, FiList]} to="/subjects" />
        <Option Icon={FiHelpCircle} title="Quiz" open={open} iconOptions={[FiEdit, FiCheckSquare]} notifs={3} to="/quiz" />
        <Option Icon={FiCalendar} title="Daily Tracker" open={open} iconOptions={[FiTrendingUp, FiClock]} to="/daily-tracker" />
        <Option Icon={FiAward} title="Ranking" open={open} iconOptions={[FiStar, FiFlag]} to="/ranking" />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, open, notifs, iconOptions = [], to }) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [Icon, ...iconOptions];
  const CurrentIcon = icons[currentIcon];

  return (
    <NavLink
      to={to}
      onClick={() => setCurrentIcon((prev) => (prev + 1) % icons.length)}
      className={({ isActive }) =>
        `navbar-link ${isActive ? 'navbar-link-active' : ''}`
      }
    >
      <div className="navbar-icon">
        <CurrentIcon />
      </div>
      {open && (
        <span className="navbar-text">
          {title}
        </span>
      )}
      {notifs && open && (
        <span className="navbar-badge">
          {notifs}
        </span>
      )}
    </NavLink>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="navbar-profile">
      <Logo />
      {open && (
        <div>
          <span className="navbar-profile-name">StudyHub</span>
          <span className="navbar-profile-plan">Premium Plan</span>
        </div>
      )}
    </div>
  );
};

const Logo = () => {
  return (
    <div className="navbar-profile-avatar">
      <svg
        width="24"
        height="24"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="navbar-profile-icon"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
      </svg>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <button
      className="navbar-logout-button"
      onClick={() => setOpen((pv) => !pv)}
    >
      <div className="navbar-logout-content">
        <span className={`navbar-logout-icon ${open ? 'navbar-logout-icon-open' : ''}`}>
        </span>
        {open && (
          <span className="navbar-logout-text">
            Collapse
          </span>
        )}
      </div>
    </button>
  );
};

export default Navbar;