import { useQuery } from "@tanstack/react-query";
import { Meal, MealDetail} from '../interfaces/mealInterfaces';
import { 
  fetchMeals as fetchMealsApi, 
  fetchMealDetails as fetchMealDetailsApi, 
  fetchMealsByCategory as fetchMealsByCategoryApi, 
  fetchMealCategories as fetchMealCategoriesApi, fetchMealsByArea as  fetchMealsByAreaApi
} from '../api/mealApi';



const fetchMeals = async (query: string) => {
  console.log(`Fetching meals with query: "${query}"...`);
  const apiMeals = await fetchMealsApi(query);
  console.log("Meals found in API:", apiMeals);

  const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  console.log("Meals found in Local Storage:", localMeals);

  let mergedMeals = [];

  if (query !== "") {
    const filteredLocalMeals = localMeals.filter((meal) =>
      meal.strMeal.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered Local Meals:", filteredLocalMeals);

    mergedMeals = [...filteredLocalMeals, ...apiMeals].filter(
      (meal, index, self) => index === self.findIndex((m) => m.idMeal === meal.idMeal)
    );
  } else {
    mergedMeals = [...localMeals, ...apiMeals].filter(
      (meal, index, self) => index === self.findIndex((m) => m.idMeal === meal.idMeal)
    );
  }

  console.log("Final Merged Meals:", mergedMeals);
  if (mergedMeals.length === 0) throw new Error("No meals found.");
  return mergedMeals;
};

export const useFetchMeals = (query: string) =>
  useQuery({
    queryKey: ["meals", query],
    queryFn: () => fetchMeals(query),
    enabled: !!query, // Fetch only if query is provided
  });



const fetchMealDetails = async (mealId: string) => {
  const apiResponse = await fetchMealDetailsApi(mealId);
  console.log(apiResponse, "React Query");

  if (apiResponse && typeof apiResponse === "object" && Object.keys(apiResponse)?.length > 0) {
    return apiResponse;
  } 

  const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  console.log("Local Storage Meals:", localMeals);

  const mealDetails = localMeals.find((meal: MealDetail) => meal.idMeal === mealId) || null;
  console.log("Local Meal Found:", mealDetails);

  return mealDetails;
};

export const useFetchMealDetails = (mealId: string) =>
  useQuery({
    queryKey: ["mealDetails", mealId],
    queryFn: () => fetchMealDetails(mealId),
    enabled: !!mealId,
  });


const fetchMealsByCategory = async (category: string) => {
  console.log(`Fetching meals for category: ${category} from API...`);
  const apiMeals = await fetchMealsByCategoryApi(category);
  console.log("API Meals:", apiMeals);

  const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  console.log("Local Storage Meals:", localMeals);

  const localMealsNotInApi = localMeals.filter(
    (meal: Meal) =>
      meal.strCategory.toLowerCase() === category.toLowerCase() &&
      !apiMeals.some((apiMeal: Meal) => apiMeal.idMeal === meal.idMeal)
  );

  console.log("Local Meals Not in API:", localMealsNotInApi);
  return [...localMealsNotInApi, ...apiMeals];
};

export const useFetchMealsByCategory = (category: string) =>
  useQuery({
    queryKey: ["mealsByCategory", category],
    queryFn: () => fetchMealsByCategory(category),
    enabled: !!category,
  });


const fetchMealsByArea = async (area: string) => {
  console.log(`Fetching meals for area: ${area} from API...`);
  const apiMeals = await fetchMealsByAreaApi(area);
  console.log("API Meals:", apiMeals);

  const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  console.log("Local Storage Meals:", localMeals);

  const localMealsNotInApi = localMeals.filter(
    (meal: Meal) =>
      meal.strArea.toLowerCase() === area.toLowerCase() &&
      !apiMeals.some((apiMeal: Meal) => apiMeal.idMeal === meal.idMeal)
  );

  console.log("Local Meals Not in API:", localMealsNotInApi);
  return [...localMealsNotInApi, ...apiMeals];
};

export const useFetchMealsByArea = (area: string) =>
  useQuery({
    queryKey: ["mealsByArea", area],
    queryFn: () => fetchMealsByArea(area),
    enabled: !!area,
  });



const fetchMealCategories = async () => {
  console.log("Fetching categories from API...");
  const apiCategories = await fetchMealCategoriesApi();
  console.log("API Categories:", apiCategories);

  const localMeals = JSON.parse(localStorage.getItem("meals") || "[]");
  console.log("Local Storage Meals:", localMeals);

  const localCategoryNames = [...new Set(localMeals.map((meal: Meal) => meal.strCategory))];

  const localCategories = localCategoryNames.map((category, index) => {
    const apiCategory = apiCategories.find(
      (apiCat) => apiCat.strCategory.toLowerCase() === category.toLowerCase()
    );

    return apiCategory
      ? { ...apiCategory }
      : {
          idCategory: `local-${index + 1}`,
          strCategory: category,
          strCategoryThumb: "",
          strCategoryDescription: "",
        };
  });

  console.log("Local Categories:", localCategories);

  const mergedCategories = [
    ...localCategories,
    ...apiCategories.filter(
      (apiCat) =>
        !localCategories.some(
          (localCat) => localCat.strCategory.toLowerCase() === apiCat.strCategory.toLowerCase()
        )
    ),
  ];

  console.log("Final Merged Categories:", mergedCategories);
  return mergedCategories;
};

export const useFetchMealCategories = () =>
  useQuery({
    queryKey: ["mealCategories"],
    queryFn: fetchMealCategories,
  });
