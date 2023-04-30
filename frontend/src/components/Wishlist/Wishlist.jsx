import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../styles/styles";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
const Wishlist = ({ setOpenWishlist }) => {
  const cartData = [
    {
      name: "Iphone 14 pro max asdasdqwqweqwe",
      description: "test",
      price: 999,
    },
    {
      name: "Iphone 14 pro max asdasdqwqweqwe",
      description: "test",
      price: 999,
    },
    {
      name: "Iphone 14 pro max asdasdqwqweqwe",
      description: "test",
      price: 999,
    },
  ];
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {/* <div className="w-full h-screen flex items-center justify-center"> */}
        <div>
          <div className="flex w-full justify-end pt-5 pr-5 ">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/* <h5>Cart Items is empty!</h5> */}
          {/* Item length */}
          <div className={`${styles.noramlFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">3 items</h5>
            {/* <h5 className="pl-2 text-[20px] font-[500]">
              {cart && cart.length} items
            </h5> */}
          </div>
          <br />
          <div className="w-full border-t">
            {cartData &&
              cartData.map((i, index) => (
                <CartSingle
                  key={index}
                  data={i}
                  //   quantityChangeHandler={quantityChangeHandler}
                  //   removeFromCartHandler={removeFromCartHandler}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const CartSingle = ({ data }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;

  // const increment = (data) => {
  //   if (data.stock < value) {
  //     toast.error("Product stock limited!");
  //   } else {
  //     setValue(value + 1);
  //     const updateCartData = { ...data, qty: value + 1 };
  //     quantityChangeHandler(updateCartData);
  //   }
  // };

  // const decrement = (data) => {
  //   setValue(value === 1 ? 1 : value - 1);
  //   const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
  //   quantityChangeHandler(updateCartData);
  // };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1 className="cursor-pointer " />
        <img
          src="https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg"
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.price} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            tile="Add to cart"
            // onClick={() => addToCartHandler(data)}
          />
        </div>
        {/* <span className="pl-[10px]">{data.qty}</span>
            <div
              className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
              onClick={() => decrement(data)}
            >
              <HiOutlineMinus size={16} color="#7d879c" />
            </div>
          </div>
          <img
            src={`${backend_url}${data?.images[0]}`}
            alt=""
            className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          />
          <div className="pl-[5px]">
            <h1>{data.name}</h1>
            <h4 className="font-[400] text-[15px] text-[#00000082]">
              ${data.discountPrice} * {value}
            </h4>
            <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
              US${totalPrice}
            </h4>
          </div>
          <RxCross1
            className="cursor-pointer"
            onClick={() => removeFromCartHandler(data)}
          /> */}
      </div>
    </div>
  );
};

export default Wishlist;
