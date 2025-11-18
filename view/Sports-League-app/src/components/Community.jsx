"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export function Community() {
  const communityPhotos = [
    {
      id: 1,
      src: "/images/community/coolkids.jpg",
      title: "Team Spirit",
      description: "Our teams building friendships and memories",
    },
    {
      id: 2,
      src: "/images/community/happy2.jpeg",
      title: "Game Day Fun",
      description: "Kids learning and having a blast",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1564890350455-b62fdb113f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Family Support",
      description: "Parents and fans cheering on our players",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1721556011920-af92ac780b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Practice Makes Perfect",
      description: "Developing skills through dedicated training",
    },
    {
      id: 5,
      src: "/images/community/field.jpg",
      title: "Our Home Field",
      description: "Where champions are made",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1615356696504-fa2dc87bc4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Team Unity",
      description: "Together we are stronger",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1729550249180-ad89793cc18d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Community Gathering",
      description: "Bringing families together through baseball",
    },
    {
      id: 8,
      src: "/images/community/coach1.jpg",
      title: "Volunteer Spirit",
      description: "Dedicated coaches making a difference",
    },
  ];

  return (
    <section className="py-2 bg-white text-gray-900">
      <div className="max-w-full">

        {/* Header */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-5xl mb-3 inline-block relative">
            Our Community
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-orange-400"></span>
          </h2>
          <p className="text-xl text-gray-600 mt-4">
            Celebrating the moments that bring us together
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full px-4 md:px-12 lg:px-20">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {communityPhotos.map((photo) => (
                <CarouselItem key={photo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-all hover:shadow-2xl group">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-2xl mb-2">{photo.title}</h3>
                            <p className="text-sm opacity-90">{photo.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4 h-14 w-14 bg-white/90 hover:bg-orange-500 hover:text-white border-2 border-orange-500 shadow-xl" />
            <CarouselNext className="right-4 h-14 w-14 bg-white/90 hover:bg-orange-500 hover:text-white border-2 border-orange-500 shadow-xl" />
          </Carousel>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-8 px-4 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-5xl text-orange-500 mb-2">500+</div>
            <p className="text-xl text-gray-600">Community Members</p>
          </div>
          <div className="text-center">
            <div className="text-5xl text-orange-500 mb-2">50+</div>
            <p className="text-xl text-gray-600">Volunteer Coaches</p>
          </div>
          <div className="text-center">
            <div className="text-5xl text-orange-500 mb-2">20+</div>
            <p className="text-xl text-gray-600">Years of Tradition</p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Community;
