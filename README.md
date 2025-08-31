# Confiado 🤝

**Transparent and secure debt management with blockchain technology.**

<div align="center">
  <img src="public/Logo_Confiado.png" alt="Confiado Logo" width="200"/>
</div>

---

<div align="center">

**🚀 Digital Trust Platform 🚀**

💰 **Smart Debt Management**
<br/>
🔐 **Secure Web3 Authentication**
<br/>
📱 **Real-time Notifications**

</div>

---

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ytconfiado-j82vhczph-yt2810s-projects.vercel.app)
[![Blockchain](https://img.shields.io/badge/Blockchain-Lisk_Testnet-4A90E2?style=for-the-badge&logo=ethereum&logoColor=white)](https://sepolia-blockscout.lisk.com/)

</div>

## What is Confiado?

Confiado revolutionizes debt management by combining blockchain transparency with an intuitive user experience. Create, confirm, and track debts securely with automatic notifications and blockchain-backed trust.

## ✨ Core Features

- **🤝 Debt Management**: Create and track debts between users transparently
- **🔐 Web3 Authentication**: Secure login with Web3Auth - no complex wallets needed
- **📧 Smart Notifications**: Automatic confirmation system via email/SMS
- **💳 Partial Payments**: Record and confirm partial payments with complete history
- **🔗 Blockchain Security**: Data integrity guaranteed on Lisk testnet
- **📱 Modern Interface**: Mobile and desktop optimized UI/UX

## 🛠️ Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Authentication**: Web3Auth + Supabase
- **Database**: Supabase
- **Blockchain**: Lisk Testnet
- **Smart Contracts**: Solidity + Hardhat
- **UI**: shadcn/ui + Lucide React

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18+)
- **pnpm** (recommended)

```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Veripact/Confiado.git
   cd Confiado
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure these variables:
   ```env
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔄 User Flow

1. **Sign Up/Login** → Web3Auth authentication
2. **Create Debt** → Creditor registers a debt
3. **Notification** → Debtor receives email/SMS confirmation
4. **Confirmation** → Debtor accepts debt via secure link
5. **Dashboard** → View debts (Total/Paid/Remaining)
6. **Partial Payments** → Record and confirm payments
7. **Completion** → Mutual confirmation of debt settlement

## 🚀 Deployment

Live application on Vercel:
- **Production**: [https://ytconfiado-j82vhczph-yt2810s-projects.vercel.app](https://ytconfiado-j82vhczph-yt2810s-projects.vercel.app)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

<div align="center">
  <strong>Built with ❤️ by the Veripact team</strong>
</div>