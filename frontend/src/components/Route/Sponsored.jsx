import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-start">
          <img
            src="https://goodfoods.com/wp-content/uploads/2020/03/gf-logo-fpo-stacked-mobile.png.png"
            alt=""
            style={{ width: "150px", objectFit: "contain" }}
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://static.vecteezy.com/system/resources/previews/014/666/044/non_2x/healthy-food-logo-vector.jpg"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/000/555/006/small/HEALTHY_FOOD_1-01.png"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://st3.depositphotos.com/33133132/34690/v/450/depositphotos_346900052-stock-illustration-healthy-food-logo-template-vector.jpg"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://www.pngkey.com/png/full/84-844370_school-lunch-png-jpg-transparent-download-healthy-food.png"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
