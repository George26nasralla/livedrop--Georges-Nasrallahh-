/**
 * SSE Client for real-time order tracking
 */

export interface OrderStatusUpdate {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  carrier: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  updatedAt: string;
  timestamp: string;
}

export class OrderSSEClient {
  private eventSource: EventSource | null = null;
  private orderId: string;
  private baseUrl: string;

  constructor(orderId: string, baseUrl: string = 'http://localhost:5000') {
    this.orderId = orderId;
    this.baseUrl = baseUrl;
  }

  /**
   * Connect to SSE stream and receive updates
   */
  connect(
    onUpdate: (data: OrderStatusUpdate) => void,
    onError?: (error: Event) => void,
    onComplete?: () => void
  ): void {
    // Close existing connection if any
    this.disconnect();

    const url = `${this.baseUrl}/api/orders/${this.orderId}/stream`;
    console.log('📡 Connecting to SSE:', url);

    this.eventSource = new EventSource(url);

    // Handle incoming messages
    this.eventSource.onmessage = (event) => {
      try {
        const data: OrderStatusUpdate = JSON.parse(event.data);
        console.log('📦 Received update:', data);
        onUpdate(data);

        // If delivered, close connection
        if (data.status === 'DELIVERED') {
          console.log('✅ Order delivered, closing connection');
          this.disconnect();
          onComplete?.();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // Handle errors
    this.eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      onError?.(error);
      
      // Close connection on error
      this.disconnect();
    };

    // Handle connection open
    this.eventSource.onopen = () => {
      console.log('✅ SSE Connection opened');
    };
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(): void {
    if (this.eventSource) {
      console.log('🔌 Closing SSE connection');
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}