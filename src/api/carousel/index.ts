import http from "..";
import { ResponseBase } from "../type";
import { CarouselItem, ResponseGetCarousel } from "./type";

enum API {
  BASE_CAROUSEL = "base/carousel",
}

export const getCarousel = () =>
  http.get<any, ResponseGetCarousel>(API.BASE_CAROUSEL, {
    withCredentials: true,
  });

export const addCarousel = (value: CarouselItem) =>
  http.post<any, ResponseBase>(API.BASE_CAROUSEL, value, {
    withCredentials: true,
  });

export const deleteCarousel = (id: string) =>
  http.delete<any, ResponseBase>(API.BASE_CAROUSEL, {
    params: { id },
    withCredentials: true,
  });

export const updateCarousel = (id: string, updateValue: CarouselItem) =>
  http.put<any, ResponseBase>(
    API.BASE_CAROUSEL,
    { id, ...updateValue },
    {
      withCredentials: true,
    }
  );
