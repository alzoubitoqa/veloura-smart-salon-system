from collections import Counter


def analyze_peak_hours(appointments):
    hour_counter = Counter()

    for appointment in appointments:
        time_value = str(appointment.get("time", ""))[:5]
        if ":" in time_value:
            hour = time_value.split(":")[0]
            hour_counter[hour] += 1

    if not hour_counter:
        return {
            "peak_hour": "No data",
            "peak_bookings": 0
        }

    peak_hour, count = hour_counter.most_common(1)[0]

    return {
        "peak_hour": f"{peak_hour}:00",
        "peak_bookings": count
    }


def analyze_low_stock_risk(inventory):
    low_stock = []
    critical_stock = []

    for item in inventory:
        quantity = int(item.get("quantity", 0))
        min_level = int(item.get("minLevel", 0))

        if quantity <= min_level:
            low_stock.append(item.get("name", "Unknown Item"))

        if quantity <= max(1, min_level // 2):
            critical_stock.append(item.get("name", "Unknown Item"))

    return {
        "low_stock_count": len(low_stock),
        "critical_stock_count": len(critical_stock),
        "low_stock_items": low_stock,
        "critical_stock_items": critical_stock
    }


def analyze_loyalty(clients):
    total_clients = len(clients)
    vip_clients = [c for c in clients if c.get("loyaltyLevel") == "VIP"]
    gold_clients = [c for c in clients if c.get("loyaltyLevel") == "Gold"]

    vip_ratio = round((len(vip_clients) / total_clients) * 100, 2) if total_clients else 0

    most_common_service_counter = Counter()
    for client in clients:
        preferred = client.get("preferredService")
        if preferred:
            most_common_service_counter[preferred] += 1

    preferred_service = (
        most_common_service_counter.most_common(1)[0][0]
        if most_common_service_counter
        else "No data"
    )

    return {
        "total_clients": total_clients,
        "vip_clients": len(vip_clients),
        "gold_clients": len(gold_clients),
        "vip_ratio": vip_ratio,
        "top_preferred_service": preferred_service
    }


def generate_smart_summary(clients, appointments, inventory):
    peak_data = analyze_peak_hours(appointments)
    stock_data = analyze_low_stock_risk(inventory)
    loyalty_data = analyze_loyalty(clients)

    recommendations = []

    if peak_data["peak_bookings"] > 0:
        recommendations.append(
            f"Peak hour is around {peak_data['peak_hour']}; assign more fast staff during this period."
        )

    if stock_data["low_stock_count"] > 0:
        recommendations.append(
            f"There are {stock_data['low_stock_count']} low-stock items; reorder soon to avoid delays."
        )

    if stock_data["critical_stock_count"] > 0:
        recommendations.append(
            f"{stock_data['critical_stock_count']} items are in critical stock condition and need urgent reorder."
        )

    if loyalty_data["vip_clients"] > 0:
        recommendations.append(
            f"You have {loyalty_data['vip_clients']} VIP clients; prioritize personalized offers and priority booking."
        )

    if loyalty_data["top_preferred_service"] != "No data":
        recommendations.append(
            f"Most preferred client service is {loyalty_data['top_preferred_service']}; create targeted bundles around it."
        )

    if not recommendations:
        recommendations.append("Not enough data yet for advanced recommendations.")

    return {
        "peak_analysis": peak_data,
        "stock_analysis": stock_data,
        "loyalty_analysis": loyalty_data,
        "recommendations": recommendations
    }