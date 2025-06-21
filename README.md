# 🌊 SATA – Sistema Anti-Trânsito por Alagamento

SATA é um projeto acadêmico que integra hardware e software para monitorar níveis de água em vias urbanas, utilizando ESP32 e sensores, acionando alertas visuais e notificações móveis em tempo real. Alimentado por energia solar, o sistema promove segurança viária e mobilidade sustentável. Essa foi minha segunda experiência com automação de sensores físicos e IoT, focada na prevenção de alagamentos.

## 🚀 Funcionalidades

- ✅ Monitoramento de nível da água em tempo real via sensores ESP32  
- ✅ Alertas visuais e notificações móveis imediatas  
- ✅ Integração com backend para armazenamento e análise de dados  
- ✅ Interface web responsiva e interativa  
- ✅ Autenticação segura para usuários  

## 🎯 Objetivo do Projeto

Desenvolver um sistema integrado de IoT e software para prevenção de alagamentos em áreas urbanas, combinando energias renováveis, sensores físicos e tecnologia web para proteger a mobilidade e a segurança da população.

## 🛠️ Tecnologias Utilizadas

| Tecnologia   | Descrição                                    |
| ------------ | --------------------------------------------|
| React        | Interface web SPA com design responsivo      |
| Tailwind CSS | Estilização rápida e moderna                  |
| Flask        | Backend Python para APIs REST e processamento |
| Python       | Lógica do backend e processamento de dados   |
| MongoDB      | Banco de dados NoSQL para armazenamento       |
| Axios        | Cliente HTTP para comunicação frontend-backend|
| JWT          | Autenticação via token seguro                 |
| bcrypt       | Hash seguro de senhas                          |
| pytesseract  | OCR para processamento de imagens             |
| Pillow       | Manipulação de imagens no backend              |
| Netlify     | Deploy da aplicação frontend                    |

## 📁 Estrutura de Pastas (Simplificada)

```plaintext
sata/
├── backend/
│   ├── app.py           # API Flask e lógica do sistema
│   ├── models.py        # Modelos do banco MongoDB
│   ├── utils/           # Funções auxiliares (ex: OCR)
│   └── requirements.txt # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── assets/      # Imagens e logos
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/          # Arquivos estáticos
│
└── README.md
```
## 📦 Instalação
### 🔧 Clone o repositório:
```plaintext
git clone https://github.com/seu-usuario/sata.git
cd sata
```
## ▶️ Backend
```plaintext
cd backend
pip install -r requirements.txt
python app.py
```
Certifique-se de que o MongoDB está rodando e configure variáveis de ambiente conforme necessário.

## ▶️ Frontend
```plaintext
cd frontend
npm install
npm run dev
```
Acesse a aplicação em http://localhost:5173.
