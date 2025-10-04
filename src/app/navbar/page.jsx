"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SignOut from "./signout/page"; // this is your modal component
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [storedName, setStoredName] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const profileName = storedName?.[0]?.toUpperCase() || "";
  const admin = useSelector((state) => state.auth.admin);

  useEffect(() => {
    setIsHydrated(true);

    // Check localStorage only after hydration
    const userName = localStorage.getItem("userName");
    if (userName) {
      setStoredName(userName);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Hide navbar on signin/signup pages
  if (pathname === "/login/signin" || pathname === "/login/signup") {
    return null;
  }

  // Show skeleton until hydrated
  if (!isHydrated) {
    return (
      <nav className="bg-neutral-900 px-4 py-2 text-white fixed top-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="w-24 h-8 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      setStoredName(null);
      router.push("/login/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setOpenLogoutModal(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = admin ? [
    { href: "/dashboard/admin/console", label: "Console" },
    { href: "/dashboard/admin/create", label: "Create" }
  ] : [
    { href: "/dashboard/user#home", label: "Home" },
    { href: "/dashboard/user#gallery", label: "Gallery" },
    { href: "/dashboard/user#process", label: "Process" },
    { href: "/dashboard/user#faq", label: "FAQ" },
    { href: "/dashboard/user#contact-us", label: "Contact" },
    { href: "/dashboard/user#about-us", label: "About" }
  ];

  return (
    <nav className="bg-neutral-900 px-4 py-2 text-white fixed top-0 w-full z-50">
      <div className="mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
  <img
    src="/images/logo.png"
    alt="Tattoo Logo"
    style={{
      width: "110px",   // set your desired width
      height: "35px",   // set your desired height
      objectFit: "contain", // makes sure logo doesn’t stretch
    }}
  />
</div>


        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            {navLinks.map((link, index) => (
              <Typography key={index} sx={{ minWidth: 100 }}>
                <Link href={link.href} className="hover:text-gray-300 transition-colors">
                  {link.label}
                </Link>
              </Typography>
            ))}
            
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>{profileName}</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </div>

        {/* Mobile Menu Button and Profile */}
        <div className="lg:hidden flex items-center gap-2">
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{profileName}</Avatar>
            </IconButton>
          </Tooltip>
          
          <IconButton
            onClick={toggleMobileMenu}
            size="large"
            aria-label="menu"
            sx={{ color: 'white' }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        {/* Desktop Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>
            <Avatar /> My account
          </MenuItem> */}
          {/* <Divider /> */}
          {/* <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add another account
          </MenuItem> */}
          {/* <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem> */}
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              setOpenLogoutModal(true);
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-neutral-900 border-t border-gray-700 shadow-lg">
          <div className="flex flex-col">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-4 text-white hover:bg-neutral-800 transition-colors border-b border-gray-700 last:border-b-0"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <SignOut
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;