const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// router.get("/",(req,res)=>{
//     res.send("this is testing routes");
// });

// get the products data

router.get("/", async (req, res) => {
  try {
    console.log("url hitted is : ", req?.url);
    res.json("Express running smoothly and fantastically");
  } catch (error) {
    console.log("error" + error.message);
  }
});

router.get("/getproducts", async (req, res) => {
  try {
    const productsData = await products.find();
    console.log(productsData + "data mila hain");
    res.status(201).json(productsData);
  } catch (error) {
    console.log("error" + error.message);
  }
});

// register the data

router.post("/register", async (req, res) => {
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    return res.status(422).json({ error: "Fill all the details" });
  }

  try {
    const preUserByEmail = await User.findOne({ email: email });
    const preUserByMobile = await User.findOne({ mobile: mobile });

    if (preUserByEmail) {
      return res.status(422).json({ error: "This email already exists" });
    }

    if (preUserByMobile) {
      return res.status(422).json({ error: "This mobile number already exists" });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const finalUser = new User({
      fname,
      email,
      mobile,
      password,
      cpassword,
    });

    // The password hashing is handled in the pre-save hook of the schema
    const storedData = await finalUser.save();
    res.status(201).json(storedData);
  } catch (error) {
    console.log("Error in registration: " + error.message);
    if (error.code === 11000) {
      return res.status(422).json({ error: "Duplicate value error: " + JSON.stringify(error.keyValue) });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});


// login data
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "fill the details" });
  }

  try {
    const userlogin = await User.findOne({ email: email });
    console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      console.log(isMatch);

      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
      } else {
        const token = await userlogin.generatAuthtoken();
        console.log(token);

        res.cookie("eccomerce", token, {
          expires: new Date(Date.now() + 2589000),
          httpOnly: true,
        });
        res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "user not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
    console.log("error the bhai catch ma for login time" + error.message);
  }
});

// getindividual

router.get("/getproductsone/:id", async (req, res) => {
  console.log("hitted \n");
  try {
    const { id } = req.params;
    console.log(id);

    const individual = await products.findOne({ id: id });
    res.status(201).json(individual);
  } catch (error) {
    res.status(400).json(error);
  }
});

// adding the data into cart
router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    console.log("perfect 6");
    const { id } = req.params;
    const cart = await products.findOne({ id: id });
    console.log(cart + "cart milta hain");

    const Usercontact = await User.findOne({ _id: req.userID });
    console.log(Usercontact + "user milta hain");

    if (Usercontact) {
      const cartData = await Usercontact.addcartdata(cart);

      await Usercontact.save();
      console.log(cartData + " thse save wait kr");
      console.log(Usercontact + "userjode save");
      res.status(201).json(Usercontact);
    }
  } catch (error) {
    console.log(error);
  }
});

// get data into the cart
router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    console.log(buyuser + "user hain buy pr");
    res.status(201).json(buyuser);
  } catch (error) {
    console.log(error + "error for buy now");
  }
});

// get user is login or not
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuserone = await User.findOne({ _id: req.userID });
    console.log("validuserone  :  ",validuserone)
    console.log(validuserone + "user hain home k header main pr");
    res.status(201).json(validuserone);
  } catch (error) {
    console.log(error + "error for valid user");
  }
});

// for userlogout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("eccomerce", { path: "/" });
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logout");
  } catch (error) {
    console.log(error + "jwt provide then logout");
  }
});

// item remove ho rhi hain lekin api delete use krna batter hoga
// remove iteam from the cart

router.get("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    req.rootUser.carts = req.rootUser.carts.filter((curel) => {
      return curel.id != id;
    });

    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("iteam remove");
  } catch (error) {
    console.log(error + "jwt provide then remove");
    res.status(400).json(error);
  }
});

module.exports = router;
