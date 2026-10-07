#!/usr/bin/env bash
# Smoke-tests every Nova Coach endpoint. Usage: ./test-endpoints.sh [base_url]
BASE="${1:-http://localhost:3001}"
J='Content-Type: application/json'
pass=0; fail=0

check() { # name expected_status actual_status body
  if [ "$2" = "$3" ]; then pass=$((pass+1)); echo "ok   $1 ($3)"; else fail=$((fail+1)); echo "FAIL $1 (got $3, want $2): $4"; fi
}
req() { # method path [body] [token] -> sets STATUS and BODY
  local args=(-s -o /tmp/nova_body -w '%{http_code}' -X "$1" "$BASE$2" -H "$J")
  [ -n "$3" ] && args+=(-d "$3")
  [ -n "$4" ] && args+=(-H "Authorization: Bearer $4")
  STATUS=$(curl "${args[@]}"); BODY=$(cat /tmp/nova_body)
}
token_of() { echo "$1" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p'; }

req GET /health;                                                         check 'health' 200 "$STATUS" "$BODY"; echo "     $BODY"
req POST /auth/login '{"email":"diabetic@nova.app","password":"demo1234"}';  check 'login demo diabetic' 200 "$STATUS" "$BODY"; DT=$(token_of "$BODY")
req POST /auth/login '{"email":"athlete@nova.app","password":"demo1234"}';   check 'login demo athlete' 200 "$STATUS" "$BODY"; AT=$(token_of "$BODY")
req POST /auth/login '{"email":"diabetic@nova.app","password":"wrongpass"}'; check 'login wrong password' 401 "$STATUS" "$BODY"
req POST /auth/login '{"email":"nobody@nova.app","password":"whatever1"}';   check 'login unknown email' 401 "$STATUS" "$BODY"
EMAIL="test$RANDOM@nova.app"
req POST /auth/signup "{\"email\":\"$EMAIL\",\"password\":\"secret123\"}"; check 'signup' 201 "$STATUS" "$BODY"; NT=$(token_of "$BODY")
req POST /auth/signup "{\"email\":\"$EMAIL\",\"password\":\"secret123\"}"; check 'signup duplicate' 409 "$STATUS" "$BODY"
req POST /auth/signup '{"email":"not-an-email","password":"x"}';           check 'signup invalid (zod)' 400 "$STATUS" "$BODY"

req GET /profile '' "$DT";                                               check 'get profile' 200 "$STATUS" "$BODY"; echo "     $BODY"
req GET /profile;                                                        check 'get profile no token' 401 "$STATUS" "$BODY"
req GET /profile '' 'garbage.token.here';                                check 'get profile bad token' 401 "$STATUS" "$BODY"
req PUT /profile '{"age":28,"goals":["High protein"],"allergies":["peanuts"],"diet":"vegetarian"}' "$NT"; check 'put profile' 200 "$STATUS" "$BODY"
req PUT /profile '{"allergies":["unicorn"]}' "$NT";                      check 'put profile invalid allergen' 400 "$STATUS" "$BODY"

BISCUIT='{"product_name":"Cream Biscuits","ingredients":"Wheat flour (maida), Sugar, Palm oil, Milk solids, Salt","generic_score":55,"flagged_ingredients":["Sugar","Palm oil"]}'
req POST /scan "$BISCUIT" "$DT";  check 'scan diabetic (gluten allergen)' 201 "$STATUS" "$BODY"; echo "     $BODY"
echo "$BODY" | grep -q '"verdict":"avoid"' && echo "$BODY" | grep -q '"allergen_override":true' \
  && { pass=$((pass+1)); echo 'ok   hard allergen rule → avoid'; } || { fail=$((fail+1)); echo 'FAIL hard allergen rule not applied'; }
req POST /scan "$BISCUIT" "$AT";  check 'scan athlete (no allergy)' 201 "$STATUS" "$BODY"; echo "     $BODY"
req POST /scan '{"product_name":"x"}' "$AT"; check 'scan invalid body' 400 "$STATUS" "$BODY"
req POST /scan "$BISCUIT";        check 'scan no token' 401 "$STATUS" "$BODY"

req GET /history '' "$DT";        check 'history' 200 "$STATUS" "$BODY"; echo "     ${BODY:0:200}"
req POST /ai/clean-ingredients '{"rawText":"NET WT 100g INGREDIENTS: Wheet flour, Sugr, Palm oil. Best before"}'; check 'ai clean-ingredients' 200 "$STATUS" "$BODY"; echo "     $BODY"
req POST /ai/home-message '{"scanCount":4,"averageScore":56,"topFlagged":["sugar"],"goals":["Less sugar"]}'; check 'ai home-message' 200 "$STATUS" "$BODY"; echo "     $BODY"
req GET /nope;                    check 'unknown route 404' 404 "$STATUS" "$BODY"

echo; echo "$pass passed, $fail failed"
