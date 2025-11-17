// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FilterQuery, Query, SortOrder } from 'mongoose';

// // Define the excluded fields as a constant array
// const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields', 'sortBy', 'order'];

// class QueryBuilder<T> {
//  public modelQuery: Query<T[], T>;
//  public query: Record<string, unknown>;

//  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
//  this.modelQuery = modelQuery;
//  this.query = query;
//  }

//  search(searchableFields: string[]) {
//  const searchTerm = this?.query?.searchTerm;
//  if (searchTerm) {
//  this.modelQuery = this.modelQuery.find({
//  $or: searchableFields.map(
//  (field) =>
//  ({
//  [field]: { $regex: searchTerm, $options: 'i' },
//  }) as FilterQuery<T>,
//  ),
//  });
//  }
// return this;
//  }

//  filter() {
//  const queryObj = { ...this.query }; // copy of the query
// excludeFields.forEach((el) => delete queryObj[el]);

//  // Initialize an array to hold all top-level query conditions (to be combined with $and)
//  const combinedFilter: FilterQuery<T>[] = [];

//  // --- 1. Handle Date Filter ---
// if (this.query.date && typeof this.query.date === 'string') {
//  // FIX: Force the date string (YYYY-MM-DD) to be interpreted as UTC midnight (00:00:00Z).
// const specificDate = new Date(`${this.query.date}T00:00:00.000Z`);

// if (isNaN(specificDate.getTime())) {
//  throw new Error('Invalid date format');
//  }

// // Calculate the start of the next day (to create a range $gte:$lt)
//  const nextDay = new Date(specificDate);
//  nextDay.setUTCDate(specificDate.getUTCDate() + 1);

//  const dateFilter: FilterQuery<T> = {
//  $or: [
//  // Match jobs whose pickup date is within the specified day
//  { 'pickupDateInfo.date': { $gte: specificDate, $lt: nextDay } },
//  // Match jobs whose delivery date is within the specified day
//  { 'deliveryDateInfo.date': { $gte: specificDate, $lt: nextDay } },
//  ] as FilterQuery<T>[],
//  };
//  combinedFilter.push(dateFilter);
//  }

//  // --- 2. Handle Location Filters (Country/Region) ---
//  if (this.query.country || this.query.region) {
//  // Use an $and wrapper to combine country and region filters
// const finalLocationFilter: FilterQuery<T> = { $and: [] };

// if (this.query.country && typeof this.query.country === 'string') {
//  // Filter by country in EITHER pickup OR delivery address
// (finalLocationFilter.$and as FilterQuery<T>[]).push({
//  $or: [
//  { 'pickupAddress.country': this.query.country },
// { 'deliveryAddress.country': this.query.country }
//  ] as FilterQuery<T>[]
//  });
// }

//  if (this.query.region && typeof this.query.region === 'string') {
// // Filter by region in EITHER pickup OR delivery address
//  (finalLocationFilter.$and as FilterQuery<T>[]).push({
//  $or: [
//  { 'pickupAddress.region': this.query.region },
//  { 'deliveryAddress.region': this.query.region }
//  ] as FilterQuery<T>[]
//  });
// }

//  // Push the $and location filter to the combined filter array if any conditions were added.
//  if ((finalLocationFilter.$and as FilterQuery<T>[]).length > 0) {
// combinedFilter.push(finalLocationFilter as FilterQuery<T>);
//  }
//  }

//  // --- 3. Handle Other Simple Filters (e.g., status: 'pending') ---
// // Simple key/value pairs from the query (like { status: 'pending' }) are added here.
//  if (Object.keys(queryObj).length > 0) {
//  combinedFilter.push(queryObj as FilterQuery<T>);
//  }

//  // --- 4. Apply all filters to the model query ---
//  // All filters (date, location, simple) are combined with an explicit $and.
//  if (combinedFilter.length > 0) {
//  this.modelQuery = this.modelQuery.find({ $and: combinedFilter } as FilterQuery<T>);
//  }

// return this;
//  }

//  sort() {
//  const sortBy = this.query.sortBy || 'createdAt'; // Default sort by createdAt
// const order: SortOrder = this.query.order === 'desc' ? -1 : 1; // Ascending by default

//  const sortOption: Record<string, SortOrder> = {};
// sortOption[sortBy as string] = order;

//  this.modelQuery = this.modelQuery.sort(sortOption);
//  return this;
//  }

//  paginate() {
//  const page = Number(this?.query?.page) || 1;
//  const limit = Number(this?.query?.limit) || 10;
//  const skip = (page - 1) * limit;

//  this.modelQuery = this.modelQuery.skip(skip).limit(limit);
//  return this;
//  }

//  fields() {
//  const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
//  this.modelQuery = this.modelQuery.select(fields);
//  return this;
//  }

//  async countTotal() {
//  // Use modelQuery.getFilter() to get the applied filter conditions for accurate counting
// const totalQueries = this.modelQuery.getFilter();
//  const total = await this.modelQuery.model.countDocuments(totalQueries);
//  const page = Number(this?.query?.page) || 1;
//  const limit = Number(this?.query?.limit) || 10;
//  const totalPage = Math.ceil(total / limit);

//  return {
//  page,
//  limit,
//  total,
//  totalPage,
//  };
// }
// }

// export default QueryBuilder;

/////////////////////////////////
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { FilterQuery, Query } from 'mongoose';

// class QueryBuilder<T> {
//   public modelQuery: Query<T[], T>;
//   public query: Record<string, unknown>;

//   constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
//     this.modelQuery = modelQuery;
//     this.query = query;
//   }

//   search(searchableFields: string[]) {
//     const searchTerm = this?.query?.searchTerm;
//     if (searchTerm) {
//       this.modelQuery = this.modelQuery.find({
//         $or: searchableFields.map(
//           (field) =>
//             ({
//               [field]: { $regex: searchTerm, $options: 'i' },
//             }) as FilterQuery<T>,
//         ),
//       });
//     }

//     return this;
//   }

//   filter() {
//     const queryObj = { ...this.query }; // copy
//     // Filtering
//     const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields','sortBy', 'order'];
//     // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
//     return this;
//   }

//   // sort() {
//   //   const sort =
//   //     (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
//   //   this.modelQuery = this.modelQuery.sort(sort as string);

//   //   return this;
//   // }
//   sort() {
//     // Default sort is by 'createdAt'
//     const sortBy = this.query.sortBy || 'createdAt'; // Field to sort by
//     const order = this.query.order === 'desc' ? -1 : 1; // Ascending by default, descending if 'desc' is passed

//     // Dynamically create the sort object based on 'sortBy' and 'order'
//     // const sortOption: Record<string, 1 | -1> = {};
//     const sortOption: Record<string, number> = {};
//     sortOption[sortBy as string] = order;

//     // Apply the sorting to the query
//     this.modelQuery = this.modelQuery.sort(sortOption as any);

//     return this;
//   }

//   paginate() {
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 10;
//     const skip = (page - 1) * limit;

//     this.modelQuery = this.modelQuery.skip(skip).limit(limit);

//     return this;
//   }

//   fields() {
//     const fields =
//       (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

//     this.modelQuery = this.modelQuery.select(fields);
//     return this;
//   }
//   async countTotal() {
//     const totalQueries = this.modelQuery.getFilter();
//     const total = await this.modelQuery.model.countDocuments(totalQueries);
//     const page = Number(this?.query?.page) || 1;
//     const limit = Number(this?.query?.limit) || 10;
//     const totalPage = Math.ceil(total / limit);

//     return {
//       page,
//       limit,
//       total,
//       totalPage,
//     };
//   }
// }

// export default QueryBuilder;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query, SortOrder } from 'mongoose';

// Define the excluded fields as a constant array
// const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields', 'sortBy', 'order', 'date', 'country', 'region'];

class QueryBuilder<T> {
 public modelQuery: Query<T[], T>;
 public query: Record<string, unknown>;

 constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
 this.modelQuery = modelQuery;
 this.query = query;
 }

 search(searchableFields: string[]) {
 const searchTerm = this?.query?.searchTerm;
 if (searchTerm) {
 // NOTE: This method still uses $regex for partial/case-insensitive search
 this.modelQuery = this.modelQuery.find({
 $or: searchableFields.map(
 (field) =>
 ({
 [field]: { $regex: searchTerm, $options: 'i' },
 }) as FilterQuery<T>,
 ),
});
}
 return this;
 }

filter() {
 const queryObj = { ...this.query }; // copy of the query
    
    // IMPORTANT: Exclude custom filters ('date', 'country', 'region') from simple queryObj
 const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields', 'sortBy', 'order', 'date', 'country', 'cityOrState', 'region'];
 excludeFields.forEach((el) => delete queryObj[el]);

 // Initialize an array to hold all top-level query conditions (to be combined with $and)
 const combinedFilter: FilterQuery<T>[] = [];

// --- 1. Handle EXACT Date Filter (YYYY-MM-DD) ---
 if (this.query.date && typeof this.query.date === 'string') {
 // Force the date string to be interpreted as UTC midnight (00:00:00Z)
 const specificDate = new Date(`${this.query.date}T00:00:00.000Z`);

 if (isNaN(specificDate.getTime())) {
 throw new Error('Invalid date format');
 }

// Calculate the start of the next day (to create a range $gte:$lt for exact day match)
const nextDay = new Date(specificDate);
nextDay.setUTCDate(specificDate.getUTCDate() + 1);

const dateFilter: FilterQuery<T> = {
 $or: [
 { 'pickupDateInfo.date': { $gte: specificDate, $lt: nextDay } },
 { 'deliveryDateInfo.date': { $gte: specificDate, $lt: nextDay } },
] as FilterQuery<T>[],
};
 combinedFilter.push(dateFilter);
 }

 // --- 2. Handle EXACT Location Filters (Country/Region) ---
 if (this.query.country || this.query.region || this.query.cityOrState) {
const finalLocationFilter: FilterQuery<T> = { $and: [] };

 if (this.query.country && typeof this.query.country === 'string') {
 // Filter by exact country match in EITHER pickup OR delivery address
 (finalLocationFilter.$and as FilterQuery<T>[]).push({
 $or: [
{ 'pickupAddress.country': this.query.country }, // EXACT MATCH
 { 'deliveryAddress.country': this.query.country } // EXACT MATCH
 ] as FilterQuery<T>[]
 });
 }

 if (this.query.region && typeof this.query.region === 'string') {
 // Filter by exact region match in EITHER pickup OR delivery address
 (finalLocationFilter.$and as FilterQuery<T>[]).push({
 $or: [
 { 'pickupAddress.cityOrState': this.query.cityOrState }, // EXACT MATCH
 { 'deliveryAddress.cityOrState': this.query.cityOrState } // EXACT MATCH
 ] as FilterQuery<T>[]
 });
 }
 
 if ((finalLocationFilter.$and as FilterQuery<T>[]).length > 0) {
 combinedFilter.push(finalLocationFilter as FilterQuery<T>);
}
 }

 // --- 3. Handle Other Simple Filters (e.g., status: 'accepted') ---
 if (Object.keys(queryObj).length > 0) {
 combinedFilter.push(queryObj as FilterQuery<T>);
 }
 
 // --- 4. Apply all filters to the model query ---
 if (combinedFilter.length > 0) {
 this.modelQuery = this.modelQuery.find({ $and: combinedFilter } as FilterQuery<T>);
 }

 return this;
 }

 sort() {
 const sortBy = this.query.sortBy || 'createdAt'; 
 const order: SortOrder = this.query.order === 'desc' ? -1 : 1; 

 const sortOption: Record<string, SortOrder> = {};
 sortOption[sortBy as string] = order;

 this.modelQuery = this.modelQuery.sort(sortOption);
 return this;
 }

 paginate() {
 const page = Number(this?.query?.page) || 1;
 const limit = Number(this?.query?.limit) || 10;
 const skip = (page - 1) * limit;

 this.modelQuery = this.modelQuery.skip(skip).limit(limit);

 return this;
 }

 fields() {
 const fields =
 (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

 this.modelQuery = this.modelQuery.select(fields);
 return this;
 }
 async countTotal() {
const totalQueries = this.modelQuery.getFilter();
 const total = await this.modelQuery.model.countDocuments(totalQueries);
const page = Number(this?.query?.page) || 1;
 const limit = Number(this?.query?.limit) || 10;
 const totalPage = Math.ceil(total / limit);

 return {
page,
limit,
 total,
 totalPage,
 };}
}

export default QueryBuilder;