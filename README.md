# Rail Verse Signalling Works ERP

Mobile-first attendance, labour allocation, employee profiles, cashbook and payroll PWA.

## Source migration
This repository is initialized from the latest committed source of `jagadhes3-design/Railverse-ERP` without modifying that original repository.

## Required Supabase setup
Run the SQL in `supabase/schema.sql` in the linked Supabase project. Never expose a service-role key in browser code.

## Deployment and testing
GitHub Actions workflows are included for ERP checks and Android APK builds. Complete live Supabase CRUD, multi-device sync, and physical-device APK tests before production use.
