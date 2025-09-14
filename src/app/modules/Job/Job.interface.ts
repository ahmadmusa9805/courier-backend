/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TJob = {
  from: string;
  to: string;
  transportationType: {
    name: string;
    options: string;
  };

  items: [{
    name: string;
    img: string;
    quantity: number;
    dimensions: string;
    materialContent: 'glass | wood | metal | food | plants | animals | others';
    price: number;
    length: string;
    width: string;
    height: string;
  }]

  pickupDateInfo: {
    date: Date;
    timeSlot: string;
  };

  deliveryDateInfo: {
    date: Date;
    timeSlot: string;
  };

  extraService: {
     service: {
       carWithLift: number;
       noNeed: number;
       extraHelp: number;
     };

     floor: {
      groundFloor: boolean;
      elevator:boolean
      level: number;
      price: number;
     };


  };

  pickupAddress: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;
  };

  deliveryAddress: {
    streetAddress: string;
    cityOrState: string;
    zipCode: string;
    country: string;
    description: string;
  };

  contact: {
    phone: string;
    email: string;
    name: {
          firstName: string;
          instagram: string;
    };
    userType: 'individual' | 'company';
  };

  status: 'active' | 'inactive';
  totalDistance: string;
  totalPrice: number;
  isDeleted: boolean;
};

export interface JobModel extends Model<TJob> {
  isJobExists(id: string): Promise<TJob | null>;
}

// export type TJob = {
//   from: string;
//   to: string;
//   transportationType: {
//     fromprivatehome: {
//       someOneYouKnow: string;
//       marketPlace: string;
//       facebookmarketPlace: string;
//       behands: string;
//       others: string;
//     };
//     fromstore: string;
//     fromanauction: {
//       onlineVeiling: string;
//       belga: string;
//       vavato: string;
//       troostwijk: string;
//       other: string;
//     };
//     smallmove: string;
//   };
//   items: {
//     name: string;
//     img: string;
//     dimensions: string;
//     quantity: number;
//     materialContent: 'glass | wood | metal | food | plants | animals | others';
//     price: string;
//     length: string;
//     width: string;
//     height: string;
//   }
//   pickupDate: Date;
//   pickupTime: string;
//   deliveryDate: Date;
//   deliveryTime: string;
//   extraService: {
//      noNeed: string;
//      extraHelp: string;
//      carWithLiftOne: string;
//      carWithLiftTwo: string;
//      floorLevel: {
//       ground: {
//         floor: number;
//         price: string;
//       };
//       basement: {
//         floor: number;
//         price: string;
//       };
//       oneFloor: {
//         floor: number;
//         price: string;
//       };
//       secondFloor: {
//         floor: number;
//         price: string;
//       };
//       thirdFloor: {
//         floor: number;
//         price: string;
//       };
//       fourthFloor: {
//         floor: number;
//         price: string;
//       };
//       fivethFloor: {
//         floor: number;
//         price: string;
//       };
//       sixthFloor: {
//         floor: number;
//         price: string;
//       };
//       seventhFloor: {
//         floor: number;
//         price: string;
//       };
//       eightthFloor: {
//         floor: number;
//         price: string;
//       };
//       ninethFloor: {
//         floor: number;
//         price: string;
//       };
//       tenthFloor: {
//         floor: number;
//         price: string;
//       };
//      };
//   };
//   status: 'active' | 'inactive';
//   totalPrice: number;
//   pickupAddress: {
//     street: string;
//     city: string;
//     postalCode: string;
//     country: string;
//     description: string;
//   };
//   deliveryAddress: {
//     street: string;
//     city: string;
//     postalCode: string;
//     country: string;
//     description: string;
//   };
//   contact: {
//     phone: string;
//     email: string;
//     name: {
//           firstName: string;
//           instagram: string;
//     };
//   }
//   isDeleted: boolean;
// };