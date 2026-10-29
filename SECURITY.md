# Política de Segurança e Modelo de Privacidade (SECURITY.md)

O projeto **RigDoctor** foi concebido e estruturado com base nos princípios de **Security by Design** e **Privacy by Default**, atendendo às exigências da LGPD (Lei Geral de Proteção de Dados - Brasil) e do GDPR (General Data Protection Regulation - União Europeia).

---

## 1. Princípios de Privacidade & Zero Telemetria

1. **Armazenamento 100% Local (Client-Side):**
   - Todas as configurações de hardware, drivers favoritos, listas de tarefas DDU e simulações de upgrade são armazenadas **exclusivamente no `localStorage` do navegador do usuário**.
   - O projeto não possui backend, banco de dados remoto ou servidores intermediários.
2. **Zero Telemetria & Sem Rastreamento:**
   - Nenhum cookie de rastreamento, fingerprinting de hardware ou script de terceiros (Google Analytics, Meta Pixel, Hotjar, etc.) está presente no código.
   - A política de segurança de conteúdo (**Content Security Policy - CSP**) bloqueia formalmente qualquer tentativa de comunicação de rede saintes do navegador.

---

## 2. Content Security Policy (CSP) em Profundidade

O arquivo `index.html` implementa uma diretiva CSP estrita via meta tag:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';
```

### Explicação Técnica das Diretivas:
- `connect-src 'none'`: **Bloqueio total de rede em JavaScript.** Impede chamadas `fetch()`, `XMLHttpRequest`, `WebSocket` e `EventSource`. Se qualquer script malicioso tentar enviar dados para fora, a engine do navegador abortará imediatamente a conexão.
- `object-src 'none'`: Desativa completamente plugins legados inseguros (Flash, Java Applets).
- `base-uri 'self'`: Impede ataques de manipulação de tag `<base>` que poderiam desviar links e formulários.
- `default-src 'self'`: Restringe carregamento de recursos exclusivamente à mesma origem.

---

## 3. Modelo de Defesa Contra Vulnerabilidades Client-Side

### A. Prevenção Contra DOM-based Cross-Site Scripting (XSS)
- O módulo `js/security.js` implementa funções utilitárias rigorosas para sanitização:
  - `escapeHTML()`: Converte caracteres perigosos (`<`, `>`, `&`, `"`, `'`, `/`, `` ` ``) em entidades HTML seguras.
  - `safeSetText()`: Manipula elementos utilizando exclusivamente a propriedade `textContent`, garantindo que nenhuma string de entrada seja interpretada como HTML executável.
  - Não há uso de `eval()`, `document.write()`, nem execução dinâmica de código.

### B. Proteção Contra Poluição de Protótipo (Prototype Pollution)
- Durante a importação de perfis JSON em `storage.js`, o método recursivo `sanitizeDeep()` filtra e descarta chaves como `__proto__`, `constructor` e `prototype`, neutralizando ataques de contaminação de propriedades globais.

### C. Validação Estrita de Schema & Integridade Criptográfica
- O método `validateProfileSchema()` valida rigorosamente:
  - Tipagem de dados (números são coagidos com limites estritos; strings possuem tamanho máximo de 64 caracteres).
  - Valores restritos aos catálogos conhecidos (CPUs, GPUs, resoluções permitidas).
- Exportações geram um hash criptográfico **SHA-256** (`crypto.subtle.digest`) para atestar a autenticidade e integridade dos dados salvos.

---

## 4. Pipeline de CI/CD DevSecOps

O repositório possui uma pipeline automatizada no GitHub Actions (`.github/workflows/security-audit.yml`):
- **Varredura de Segredos:** Detecta chaves de API, senhas ou tokens acidentalmente inseridos.
- **Auditoria de CSP:** Garante que a regra `connect-src 'none'` permaneça inviolada.
- **Análise Estática de Código (SAST):** Inspeciona scripts em busca de funções perigosas ou práticas inseguras.
- **Verificação Léxica:** Validação de integridade sintática e fechamento correto de blocos JavaScript.

---

## 5. Reporte de Vulnerabilidades

Se você identificar qualquer vulnerabilidade de segurança no RigDoctor:
1. **Não abra uma Issue pública** no repositório.
2. Envie os detalhes técnicos da vulnerabilidade através do recurso **Security Advisories** privado do GitHub.
3. Inclua passos reproduzíveis, versão do navegador testado e impacto estimado.
4. Nossa equipe responderá em até 48 horas úteis com uma avaliação técnica e plano de mitigação.
