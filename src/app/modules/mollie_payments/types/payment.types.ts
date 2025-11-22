export interface PaymentInfo {
  resource: string
  id: string
  mode: string
  createdAt: string
  amount: Amount
  description: string
  method: string
  metadata: Metadata
  status: string
  paidAt: string
  amountRefunded: AmountRefunded
  amountRemaining: AmountRemaining
  locale: string
  profileId: string
  sequenceType: string
  redirectUrl: string
  webhookUrl: string
  settlementAmount: SettlementAmount
  details: Details
  _links: Links
}

export interface Amount {
  value: string
  currency: string
}

export interface Metadata {
  userId: string
  fromAddress: FromAddress
  toAddress: ToAddress
  pickupType: string
  itemSource: string
  items: Item[]
  pickupDate: string
  timeSlot: TimeSlot
  extraServices: ExtraServices
  deliveryContact: DeliveryContact
  totalPrice: string
  userType: string
  companyName: string
  vinNumber: string
}

export interface FromAddress {
  address: string
  country: string
  region: string
  city: string
  postalCode: string
  lat: number
  lng: number
}

export interface ToAddress {
  address: string
  country: string
  region: string
  city: string
  postalCode: string
  lat: number
  lng: number
}

export interface Item {
  name: string
  length: number
  width: number
  height: number
  material: string
  image: string
  qty: number
  price: number
}

export interface TimeSlot {
  start: string
  end: string
  cost: number
}

export interface ExtraServices {
  floor: string
  helpers: number
  help: string
}

export interface DeliveryContact {
  smartHomeAddress: string
  region: string
  country: string
  city: string
  zipCode: string
  additionalInfo: string
}

export interface AmountRefunded {
  value: string
  currency: string
}

export interface AmountRemaining {
  value: string
  currency: string
}

export interface SettlementAmount {
  value: string
  currency: string
}

export interface Details {
  cardToken: string
  cardNumber: string
  cardHolder: string
  cardAudience: string
  cardLabel: string
  cardCountryCode: string
  cardIssuerCountry: string
  feeRegion: string
  fraudScore: number
}

export interface Links {
  self: Self
  dashboard: Dashboard
  changePaymentState: ChangePaymentState
  documentation: Documentation
}

export interface Self {
  href: string
  type: string
}

export interface Dashboard {
  href: string
  type: string
}

export interface ChangePaymentState {
  href: string
  type: string
}

export interface Documentation {
  href: string
  type: string
}
