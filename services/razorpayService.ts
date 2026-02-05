export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler: (response: any) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: {
        [key: string]: string;
    };
    theme?: {
        color?: string;
    };
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

class RazorpayService {
    private keyId: string;

    constructor() {
        this.keyId = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || '';
    }

    public async openCheckout(amount: number, onSucess: (response: any) => void) {
        if (!this.keyId) {
            console.error('Razorpay Key ID is not defined');
            return;
        }

        const options: RazorpayOptions = {
            key: this.keyId,
            amount: amount * 100, // Amount in subunits (e.g., paise)
            currency: 'INR',
            name: 'TryMyra',
            description: 'Wallet Top Up',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRUtB_EbHMvAPD6rwMWZlEkixUuGtNEYGupHhKQJOOHNZZmudmNT43nYYqiKkFSf5fOojy1QNtaa5ooF-yLdo3GdbFNhVjKlchwngMmtpz70SzIAx6XCLOp3QRyFaqT3yTe0CFgX8A8bfvoCbGPTHJVKZdrf79ADXiifMGaFA_zAol6dvGfvQZZctu8qhtM0Q2EpqYW-WCd9x6BX6dtIG3lYvmtUeLw3Y9ldpfJQIsz1NeujP6WdpIS8HVOlbMbTotdYL5ShivIq0',
            handler: (response: any) => {
                onSucess(response);
            },
            prefill: {
                name: 'Alex Morgan',
                email: 'alex@example.com',
                contact: '9999999999'
            },
            theme: {
                color: '#3713ec'
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }
}

export const razorpayService = new RazorpayService();
