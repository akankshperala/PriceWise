import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col gap-3 max-w-[240px] bg-white rounded-xl shadow hover:shadow-lg transition p-3"
    >
      <div className="relative w-full h-48 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex justify-between text-xs text-gray-600">
          <p className="capitalize">{product.category}</p>
          <p className="font-bold text-gray-900">
            {product?.currency}{product?.currentPrice}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
