"use client";
import Image from "next/image";
import Link from "next/link";
import classes from "../../css/HomeNavbar.module.css";
import { usePathname } from "next/navigation";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

const HomeNavbar = () => {
  const pathname = usePathname();
  const [results, setResults] = useState([]);
  const [isActive, setisActive] = useState(false);
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userinfo"))
      : null;
  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userdata"))
      : null;

  const searchContainerClasses = isActive
    ? `${classes.search_container} ${classes.isActive}`
    : `${classes.search_container}`;

  async function searchUser(e) {
    const value = e.target.value;

    try {
      if (value) {
        const res = await fetch(`/api/search/${value}`);
        const resData = await res.json();

        if (res.ok) {
          setResults(resData);
          setisActive(true);
        }
      } else {
        setResults([]);
        setisActive(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className={classes.home_navbar}>
      <div className={classes.logo}>
        <Image src="/images/logo_blue.png" width={200} height={70} alt="logo" />
      </div>
      <div className={classes.search_form_div}>
        {token?.token && (
          <div className={classes.search_bar}>
            <TextField
              className={classes.search_input}
              placeholder="Search users"
              type="text"
              required
              onChange={searchUser}
              onMouseEnter={() => setisActive(true)}
              onMouseLeave={() => setisActive(false)}
            />
          </div>
        )}
        <Card
          className={searchContainerClasses}
          onMouseLeave={() => setisActive(false)}
          onMouseEnter={() => setisActive(true)}
        >
          {isActive &&
            results.map((result, i) => {
              return (
                <Link href={`/${result._id}`} key={i}>
                  <div className={classes.result_div}>
                    <Image
                      src={result.image}
                      width={60}
                      height={60}
                      alt="user"
                    />
                    <Typography fontWeight="bold" color="textPrimary">
                      {result.first_name} {result.last_name}
                    </Typography>
                  </div>
                </Link>
              );
            })}
        </Card>
      </div>
      <div className={classes.nav_buttons}>
        {token?.token ? (
          <Link
            className="link_no_decoration"
            href={pathname === "/" ? "/dashboard" : "/"}
          >
            {pathname === "/" ? "Go to dashboard" : "Go to home"}
          </Link>
        ) : (
          ""
        )}
      </div>
      {token?.token ? (
        <div className={classes.nav_profile}>
          <Typography variant="p" fontWeight="bold">
            {user.firstname
              ? user.firstname.concat(" ", user.lastname)
              : "John Doe"}
          </Typography>
          <Image
            src={user.image ? user.image : "/images/setting.png"}
            width={48}
            height={48}
            alt="logo"
            style={{ borderRadius: "100px" }}
          />
        </div>
      ) : (
        <div className={classes.landing_buttons}>
          <Button variant="contained" fontWeight="bold" size="large">
            <Link href="/signup" className="link_no_decoration">
              Sign Up Today!
            </Link>
          </Button>
          <Button variant="contained" fontWeight="bold" size="large">
            <Link href="/login" className="link_no_decoration">
              Log in to Account
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
};
export default HomeNavbar;