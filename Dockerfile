# Step 1: builder
FROM thanhnguyenit/node-stack:10-builder AS builder

# Step 2: runtime
FROM thanhnguyenit/node-stack:10-runtime