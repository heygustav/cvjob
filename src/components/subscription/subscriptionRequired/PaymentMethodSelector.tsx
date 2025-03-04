
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentMethodSelectorProps {
  paymentMethod: 'stripe' | 'mobilepay';
  setPaymentMethod: (method: 'stripe' | 'mobilepay') => void;
  showDebug: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  showDebug
}) => {
  return (
    <Tabs defaultValue={paymentMethod} className="w-full" onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'mobilepay')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stripe">Kreditkort</TabsTrigger>
        <TabsTrigger value="mobilepay">MobilePay</TabsTrigger>
      </TabsList>
      <TabsContent value="stripe" className="text-center py-4">
        Betal sikkert med dit kreditkort via Stripe
        {showDebug && (
          <div className="mt-2 text-xs text-muted-foreground">
            Test kort: 4242 4242 4242 4242, enhver fremtidig udløbsdato, enhver CVC
          </div>
        )}
      </TabsContent>
      <TabsContent value="mobilepay" className="text-center py-4">
        Betal nemt med MobilePay
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodSelector;
